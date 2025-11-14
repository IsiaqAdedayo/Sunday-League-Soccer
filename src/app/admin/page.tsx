"use client";

import { db } from "../../lib/firebase";
import { Button, Card, Form, Input, message } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoFootball, IoLockClosed } from "react-icons/io5";
import styles from "./admin.module.css";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { password: string }) => {
    setLoading(true);
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "tournament"));
      const adminPassword = settingsDoc.data()?.adminPassword || "admin123";

      if (values.password === adminPassword) {
        sessionStorage.setItem("adminAuth", "true");
        message.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        message.error("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.loginBox}
      >
        <Card className={styles.card}>
          <div className={styles.header}>
            <IoFootball className={styles.logo} />
            <h1 className={styles.title}>Admin Panel</h1>
            <p className={styles.subtitle}>Sunday League Soccer Management</p>
          </div>

          <Form
            name="admin-login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter the admin password" },
              ]}
            >
              <Input.Password
                prefix={<IoLockClosed />}
                placeholder="Enter admin password"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className={styles.button}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <a href="/" className={styles.backLink}>
              ← Back to Home
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
