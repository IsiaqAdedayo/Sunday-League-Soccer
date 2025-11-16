"use client";

import { useState, useEffect } from "react";
import { Input, Button, List, message, Avatar } from "antd";
import { IoSend, IoPerson } from "react-icons/io5";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Comment } from "../../types";
import { formatDistanceToNow } from "date-fns";
import styles from "./CommentSection.module.css";

interface CommentSectionProps {
  mediaId: string;
}

export default function CommentSection({ mediaId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchComments();
  }, [mediaId]);

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, "comments"),
        where("mediaId", "==", mediaId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      message.error("Please enter a comment");
      return;
    }

    if (!userName.trim()) {
      message.error("Please enter your name");
      return;
    }

    setSubmitting(true);

    try {
      const commentData = {
        mediaId,
        userName: userName.trim(),
        text: commentText.trim(),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "comments"), commentData);

      // Update comment count in media document
      await updateDoc(doc(db, "gallery", mediaId), {
        commentCount: increment(1),
      });

      message.success("Comment posted!");
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      message.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.title}>💬 Comments ({comments.length})</h3>

      <div className={styles.commentForm}>
        <Input
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={styles.nameInput}
          maxLength={50}
        />
        <Input.TextArea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          maxLength={500}
        />
        <Button
          type="primary"
          icon={<IoSend />}
          onClick={handleSubmit}
          loading={submitting}
          className={styles.submitButton}
        >
          Post Comment
        </Button>
      </div>

      <List
        loading={loading}
        dataSource={comments}
        locale={{ emptyText: "No comments yet. Be the first to comment!" }}
        renderItem={(comment) => (
          <List.Item className={styles.comment}>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<IoPerson />}
                  style={{ backgroundColor: "#00FF87" }}
                />
              }
              title={
                <div className={styles.commentHeader}>
                  <span className={styles.userName}>{comment.userName}</span>
                  <span className={styles.timestamp}>
                    {formatDistanceToNow(
                      comment.createdAt?.toDate?.() || new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </span>
                </div>
              }
              description={<p className={styles.commentText}>{comment.text}</p>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
