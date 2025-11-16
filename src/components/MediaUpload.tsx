'use client';

import { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Upload, Button, message, Progress } from 'antd';
import { IoCloudUpload } from 'react-icons/io5';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import imageCompression from 'browser-image-compression';

interface MediaUploadProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teams: string[];
}

export default function MediaUpload({ visible, onClose, onSuccess, teams }: MediaUploadProps) {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);

  // Compress image before upload
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      return file;
    }
  };

  // Generate thumbnail from image
  const generateImageThumbnails = async (file: File) => {
    const createThumbnail = async (maxSize: number) => {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: maxSize,
        useWebWorker: true,
      };
      return await imageCompression(file, options);
    };

    const [small, medium] = await Promise.all([
      createThumbnail(200),
      createThumbnail(500),
    ]);

    return { small, medium };
  };

  // Generate video thumbnail (extract first frame)
  const generateVideoThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };

      video.onseeked = () => {
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      };

      video.onerror = () => reject(new Error('Failed to load video'));

      video.src = URL.createObjectURL(file);
      video.currentTime = 1; // Get frame at 1 second
    });
  };

  // Upload file to Firebase Storage
  const uploadFile = (file: File | Blob, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(prog));
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file');
      return;
    }

    try {
      const values = await form.validateFields();
      setUploading(true);

      const file = fileList[0];
      const isVideo = file.type.startsWith('video/');
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;

      let url: string;
      let thumbnail: string | undefined;
      let thumbnailSmall: string | undefined;
      let thumbnailMedium: string | undefined;

      if (isVideo) {
        // Upload original video
        message.loading('Uploading video...', 0);
        url = await uploadFile(file, `gallery/videos/${fileName}`);

        // Generate and upload video thumbnail
        message.loading('Generating video thumbnail...', 0);
        const thumbBlob = await generateVideoThumbnail(file);
        thumbnail = await uploadFile(thumbBlob, `gallery/thumbnails/${timestamp}_thumb.jpg`);
        thumbnailSmall = thumbnail; // Use same for now
        thumbnailMedium = thumbnail;

      } else {
        // Compress and upload image
        message.loading('Compressing image...', 0);
        const compressed = await compressImage(file);
        url = await uploadFile(compressed, `gallery/photos/${fileName}`);

        // Generate and upload thumbnails
        message.loading('Generating thumbnails...', 0);
        const thumbnails = await generateImageThumbnails(file);

        thumbnailSmall = await uploadFile(
          thumbnails.small,
          `gallery/thumbnails/${timestamp}_small.jpg`
        );
        thumbnailMedium = await uploadFile(
          thumbnails.medium,
          `gallery/thumbnails/${timestamp}_medium.jpg`
        );
        thumbnail = thumbnailMedium;
      }

      message.destroy();
      message.loading('Saving to database...', 0);

      // Save to Firestore
      const mediaData = {
        type: isVideo ? 'video' : 'photo',
        title: values.title,
        description: values.description || '',
        category: values.category,
        matchday: values.matchday || null,
        teams: values.teams || [],
        url,
        thumbnail,
        thumbnailSmall,
        thumbnailMedium,
        duration: isVideo ? values.duration : undefined,
        views: 0,
        likes: 0,
        commentCount: 0,
        uploadedAt: new Date(),
        uploadedBy: 'admin',
      };

      await addDoc(collection(db, 'gallery'), mediaData);

      message.destroy();
      message.success('Media uploaded successfully!');

      form.resetFields();
      setFileList([]);
      setProgress(0);
      setUploading(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      message.destroy();
      message.error('Failed to upload');
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Upload Photo or Video"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          loading={uploading}
        >
          Upload
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="File">
          <Upload
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              const isVideo = file.type.startsWith('video/');

              if (!isImage && !isVideo) {
                message.error('You can only upload image or video files!');
                return false;
              }

              const maxSize = isVideo ? 500 : 10; // MB
              if (file.size / 1024 / 1024 > maxSize) {
                message.error(`File must be smaller than ${maxSize}MB!`);
                return false;
              }

              setFileList([file]);
              return false;
            }}
            fileList={fileList}
            onRemove={() => setFileList([])}
            maxCount={1}
          >
            <Button icon={<IoCloudUpload />}>Select File</Button>
          </Upload>
        </Form.Item>

        {uploading && <Progress percent={progress} />}

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="e.g., Amazing Goal by Player Name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Describe the moment..." />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="match-action">Match Action</Select.Option>
            <Select.Option value="team-photos">Team Photos</Select.Option>
            <Select.Option value="behind-scenes">Behind Scenes</Select.Option>
            <Select.Option value="top-moments">Top Moments</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="matchday" label="Matchday">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="teams" label="Teams">
          <Select mode="multiple" maxCount={2}>
            {teams.map((team) => (
              <Select.Option key={team} value={team}>
                {team}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {fileList[0]?.type.startsWith('video/') && (
          <Form.Item name="duration" label="Duration (seconds)">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
