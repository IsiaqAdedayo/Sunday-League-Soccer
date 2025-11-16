"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, Modal, Tabs, Empty, Button } from "antd";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navigation from "@/components/Navigation";
import CommentSection from "@/components/CommentSection";
import ShareButtons from "@/components/ShareButtons";
import { Media } from "../../../types";
import ReactPlayer from "react-player";
import Masonry from "react-masonry-css";
import {
  IoPlayCircle,
  IoHeart,
  IoEye,
  IoClose,
  IoDownload,
  IoChatbubble,
} from "react-icons/io5";
import styles from "./gallery.module.css";

export default function GalleryPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    filterMedia(activeFilter);
  }, [media, activeFilter]);

  const fetchMedia = async () => {
    try {
      const snapshot = await getDocs(collection(db, "gallery"));
      const mediaData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Media[];

      mediaData.sort((a, b) => b.uploadedAt?.seconds - a.uploadedAt?.seconds);
      setMedia(mediaData);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = (filter: string) => {
    if (filter === "all") {
      setFilteredMedia(media);
    } else if (filter === "photos") {
      setFilteredMedia(media.filter((m) => m.type === "photo"));
    } else if (filter === "videos") {
      setFilteredMedia(media.filter((m) => m.type === "video"));
    } else {
      setFilteredMedia(media.filter((m) => m.category === filter));
    }
  };

  const handleMediaClick = async (item: Media) => {
    setSelectedMedia(item);

    try {
      await updateDoc(doc(db, "gallery", item.id), {
        views: increment(1),
      });

      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, views: m.views + 1 } : m))
      );
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  const handleLike = async () => {
    if (!selectedMedia) return;

    try {
      await updateDoc(doc(db, "gallery", selectedMedia.id), {
        likes: increment(1),
      });

      setMedia((prev) =>
        prev.map((m) =>
          m.id === selectedMedia.id ? { ...m, likes: m.likes + 1 } : m
        )
      );

      setSelectedMedia({ ...selectedMedia, likes: selectedMedia.likes + 1 });
    } catch (error) {
      console.error("Error liking media:", error);
    }
  };

  const handleDownload = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(selectedMedia.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedMedia.title}.${selectedMedia.type === "video" ? "mp4" : "jpg"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const MediaCard = ({ item }: { item: Media }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={styles.mediaCard}
      onClick={() => handleMediaClick(item)}
    >
      <div className={styles.mediaWrapper}>
        {item.type === "video" ? (
          <>
            <img
              src={item.thumbnailMedium || item.thumbnail}
              alt={item.title}
              className={styles.thumbnail}
            />
            <div className={styles.videoOverlay}>
              <IoPlayCircle className={styles.playIcon} />
              <div className={styles.duration}>
                {formatDuration(item.duration || 0)}
              </div>
            </div>
          </>
        ) : (
          <img
            src={item.thumbnailMedium || item.url}
            alt={item.title}
            className={styles.photo}
          />
        )}

        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <h3>{item.title}</h3>
            <div className={styles.stats}>
              <span>
                <IoEye /> {item.views}
              </span>
              <span>
                <IoHeart /> {item.likes}
              </span>
              <span>
                <IoChatbubble /> {item.commentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>📷 Match Day Memories</h1>
          <p className={styles.subtitle}>
            Relive the greatest moments of SLS 2024/2025
          </p>
        </motion.div>

        <Tabs
          activeKey={activeFilter}
          onChange={setActiveFilter}
          items={[
            { key: "all", label: "📸 All Media" },
            { key: "photos", label: "📷 Photos" },
            { key: "videos", label: "🎥 Videos" },
            { key: "match-action", label: "⚽ Match Action" },
            { key: "team-photos", label: "👥 Team Photos" },
            { key: "behind-scenes", label: "🎬 Behind Scenes" },
            { key: "top-moments", label: "🏆 Top Moments" },
          ]}
          className={styles.tabs}
        />

        {loading ? (
          <div className={styles.loading}>Loading gallery...</div>
        ) : filteredMedia.length === 0 ? (
          <Empty description="No media available yet" />
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className={styles.masonryGrid}
            columnClassName={styles.masonryColumn}
          >
            {filteredMedia.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </Masonry>
        )}

        <Modal
          open={!!selectedMedia}
          onCancel={() => setSelectedMedia(null)}
          footer={null}
          width="90%"
          className={styles.modal}
          closeIcon={<IoClose />}
        >
          {selectedMedia && (
            <div className={styles.modalContent}>
              {selectedMedia.type === "video" ? (
                <div className={styles.videoPlayer}>
                  <ReactPlayer
                    src={selectedMedia.url}
                    controls
                    width="100%"
                    height="100%"
                    playing
                  />
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className={styles.modalImage}
                />
              )}

              <div className={styles.modalInfo}>
                <h2>{selectedMedia.title}</h2>
                {selectedMedia.description && (
                  <p>{selectedMedia.description}</p>
                )}

                {selectedMedia.matchday && (
                  <div className={styles.badge}>
                    ⚽ Matchday {selectedMedia.matchday}
                  </div>
                )}

                {selectedMedia.teams && selectedMedia.teams.length > 0 && (
                  <div className={styles.teams}>
                    {selectedMedia.teams[0]} vs {selectedMedia.teams[1]}
                  </div>
                )}

                <div className={styles.actions}>
                  <Button
                    type="primary"
                    icon={<IoHeart />}
                    onClick={handleLike}
                  >
                    Like ({selectedMedia.likes})
                  </Button>
                  <Button icon={<IoDownload />} onClick={handleDownload}>
                    Download
                  </Button>
                </div>

                <div className={styles.viewCount}>
                  <IoEye /> {selectedMedia.views} views
                </div>

                <ShareButtons
                  url={selectedMedia.url}
                  title={selectedMedia.title}
                  description={selectedMedia.description}
                />

                <CommentSection mediaId={selectedMedia.id} />
              </div>
            </div>
          )}
        </Modal>
      </main>
    </>
  );
}
