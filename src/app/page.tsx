"use client";

import { motion } from "framer-motion";
import { Card, Row, Col, Statistic } from "antd";
import {
  IoTrophy,
  IoCalendar,
  IoPeople,
  IoFlame,
  IoFootball,
} from "react-icons/io5";
import Navigation from "../components/Navigation";
import FootballAnimation from "../components/FootballAnimation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "./page.module.css";

export default function Home() {
  const [stats, setStats] = useState({
    totalMatches: 0,
    matchesPlayed: 0,
    totalGoals: 0,
    teams: 4,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fixturesSnap = await getDocs(collection(db, "fixtures"));
        const playedMatches = fixturesSnap.docs.filter(
          (doc) => doc.data().status === "finished"
        );

        let totalGoals = 0;
        playedMatches.forEach((doc) => {
          const data = doc.data();
          totalGoals += (data.homeScore || 0) + (data.awayScore || 0);
        });

        setStats({
          totalMatches: fixturesSnap.size,
          matchesPlayed: playedMatches.length,
          totalGoals,
          teams: 4,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <Navigation />
      <FootballAnimation />
      <main className={styles.main}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={styles.hero}
        >
          <motion.div variants={itemVariants} className={styles.heroContent}>
            <motion.h1
              className={styles.title}
              animate={{
                textShadow: [
                  "0 0 20px rgba(0, 255, 135, 0.5)",
                  "0 0 40px rgba(0, 255, 135, 0.8)",
                  "0 0 20px rgba(0, 255, 135, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Sunday League Soccer
            </motion.h1>
            <motion.p variants={itemVariants} className={styles.subtitle}>
              Amateur Football Tournament 2024/2025
            </motion.p>
            <motion.div variants={itemVariants} className={styles.badge}>
              <IoTrophy size={24} />
              <span>Live Tournament</span>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Row gutter={[16, 16]} className={styles.statsRow}>
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Teams"
                      value={stats.teams}
                      prefix={<IoPeople className={styles.statIcon} />}
                      valueStyle={{
                        color: "#00FF87",
                        fontSize: "42px",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Total Matches"
                      value={stats.totalMatches}
                      prefix={<IoCalendar className={styles.statIcon} />}
                      valueStyle={{
                        color: "#3B82F6",
                        fontSize: "42px",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Matches Played"
                      value={stats.matchesPlayed}
                      prefix={<IoTrophy className={styles.statIcon} />}
                      valueStyle={{
                        color: "#F59E0B",
                        fontSize: "42px",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={styles.statCard}>
                    <Statistic
                      title="Total Goals"
                      value={stats.totalGoals}
                      prefix={<IoFlame className={styles.statIcon} />}
                      valueStyle={{
                        color: "#EF4444",
                        fontSize: "42px",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={styles.featuresSection}
          >
            <h2 className={styles.sectionTitle}>Tournament Features</h2>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <motion.div whileHover={{ y: -10 }}>
                  <Card className={styles.featureCard}>
                    <IoCalendar size={48} className={styles.featureIcon} />
                    <h3>Live Fixtures</h3>
                    <p>Track all matches, scores, and schedules in real-time</p>
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div whileHover={{ y: -10 }}>
                  <Card className={styles.featureCard}>
                    <IoTrophy size={48} className={styles.featureIcon} />
                    <h3>Standings</h3>
                    <p>
                      Live league table with points, goal difference, and
                      rankings
                    </p>
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div whileHover={{ y: -10 }}>
                  <Card className={styles.featureCard}>
                    <IoFlame size={48} className={styles.featureIcon} />
                    <h3>Player Stats</h3>
                    <p>Top scorers, assists, clean sheets, and more</p>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={styles.footer}
        >
          <div className={styles.footerContent}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <IoFootball size={32} />
                <span>SLS Tournament</span>
              </div>
              <motion.a
                href="https://wa.me/2348184212250"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Contact Admin
              </motion.a>
            </div>

            <div className={styles.footerDivider}></div>

            <div className={styles.footerBottom}>
              <p className={styles.copyright}>
                © {new Date().getFullYear()} Sunday League Soccer. All rights
                reserved.
              </p>
              <p className={styles.tagline}>
                Built with ⚽ for the love of the game
              </p>
            </div>
          </div>
        </motion.footer>
      </main>
    </>
  );
}
