"use client";

import Navigation from "../../components/Navigation";
import { db } from "../../lib/firebase";
import { Player } from "../../../types";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IoClose,
  IoFlash,
  IoFootball,
  IoShield,
  IoWarning,
} from "react-icons/io5";
import styles from "./stats.module.css";

export default function StatsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "players"));
      const playersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Player[];
      setPlayers(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const topScorers = [...players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);
  const topAssists = [...players]
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);
  const cleanSheets = [...players]
    .filter((p) => p.position === "DEF" || p.position === "GK")
    .sort((a, b) => (b.cleanSheets || 0) - (a.cleanSheets || 0))
    .slice(0, 10);

  const scorerColumns: ColumnsType<Player> = [
    {
      title: "#",
      key: "rank",
      width: 60,
      align: "center",
      render: (_: any, __: Player, index: number) => (
        <span className={index < 3 ? styles.topRank : ""}>{index + 1}</span>
      ),
    },
    {
      title: "Player",
      dataIndex: "name",
      key: "name",
      render: (name: string, _: Player, index: number) => (
        <span className={index < 3 ? styles.topPlayer : ""}>{name}</span>
      ),
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: (
        <div className={styles.iconHeader}>
          <IoFootball /> Goals
        </div>
      ),
      dataIndex: "goals",
      key: "goals",
      width: 100,
      align: "center",
      render: (goals: number, _: Player, index: number) => (
        <span className={index < 3 ? styles.topStat : styles.stat}>
          {goals}
        </span>
      ),
    },
  ];

  const assistColumns: ColumnsType<Player> = [
    {
      title: "#",
      key: "rank",
      width: 60,
      align: "center",
      render: (_: any, __: Player, index: number) => (
        <span className={index < 3 ? styles.topRank : ""}>{index + 1}</span>
      ),
    },
    {
      title: "Player",
      dataIndex: "name",
      key: "name",
      render: (name: string, _: Player, index: number) => (
        <span className={index < 3 ? styles.topPlayer : ""}>{name}</span>
      ),
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: (
        <div className={styles.iconHeader}>
          <IoFlash /> Assists
        </div>
      ),
      dataIndex: "assists",
      key: "assists",
      width: 100,
      align: "center",
      render: (assists: number, _: Player, index: number) => (
        <span className={index < 3 ? styles.topStat : styles.stat}>
          {assists}
        </span>
      ),
    },
  ];

  const cleanSheetColumns: ColumnsType<Player> = [
    {
      title: "#",
      key: "rank",
      width: 60,
      align: "center",
      render: (_: any, __: Player, index: number) => (
        <span className={index < 3 ? styles.topRank : ""}>{index + 1}</span>
      ),
    },
    {
      title: "Player",
      dataIndex: "name",
      key: "name",
      render: (name: string, _: Player, index: number) => (
        <span className={index < 3 ? styles.topPlayer : ""}>{name}</span>
      ),
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 100,
      align: "center",
    },
    {
      title: (
        <div className={styles.iconHeader}>
          <IoShield /> Clean Sheets
        </div>
      ),
      dataIndex: "cleanSheets",
      key: "cleanSheets",
      width: 140,
      align: "center",
      render: (cs: number, _: Player, index: number) => (
        <span className={index < 3 ? styles.topStat : styles.stat}>
          {cs || 0}
        </span>
      ),
    },
  ];

  const disciplineColumns: ColumnsType<Player> = [
    {
      title: "Player",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: (
        <div className={styles.iconHeader}>
          <IoWarning /> Yellow
        </div>
      ),
      dataIndex: "yellowCards",
      key: "yellowCards",
      width: 100,
      align: "center",
      render: (cards: number) => (
        <span className={styles.yellowCard}>{cards || 0}</span>
      ),
    },
    {
      title: (
        <div className={styles.iconHeader}>
          <IoClose /> Red
        </div>
      ),
      dataIndex: "redCards",
      key: "redCards",
      width: 100,
      align: "center",
      render: (cards: number) => (
        <span className={styles.redCard}>{cards || 0}</span>
      ),
    },
  ];

  const playersWithCards = players.filter(
    (p) =>
      (p.yellowCards && p.yellowCards > 0) || (p.redCards && p.redCards > 0)
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
          <h1 className={styles.title}>Player Statistics</h1>
          <p className={styles.subtitle}>Top performers of the tournament</p>
        </motion.div>

        <div className={styles.statsContainer}>
          {/* Top Scorers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.statSection}
          >
            <div className={styles.sectionHeader}>
              <IoFootball className={styles.sectionIcon} />
              <h2>Top Scorers</h2>
            </div>
            <Card className={styles.card}>
              <Table
                columns={scorerColumns}
                dataSource={topScorers}
                rowKey="id"
                loading={loading}
                pagination={false}
              />
            </Card>
          </motion.div>

          {/* Top Assists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.statSection}
          >
            <div className={styles.sectionHeader}>
              <IoFlash className={styles.sectionIcon} />
              <h2>Top Assists</h2>
            </div>
            <Card className={styles.card}>
              <Table
                columns={assistColumns}
                dataSource={topAssists}
                rowKey="id"
                loading={loading}
                pagination={false}
              />
            </Card>
          </motion.div>

          {/* Clean Sheets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.statSection}
          >
            <div className={styles.sectionHeader}>
              <IoShield className={styles.sectionIcon} />
              <h2>Clean Sheets</h2>
            </div>
            <Card className={styles.card}>
              <Table
                columns={cleanSheetColumns}
                dataSource={cleanSheets}
                rowKey="id"
                loading={loading}
                pagination={false}
              />
            </Card>
          </motion.div>

          {/* Discipline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.statSection}
          >
            <div className={styles.sectionHeader}>
              <IoWarning className={styles.sectionIcon} />
              <h2>Discipline</h2>
            </div>
            <Card className={styles.card}>
              <Table
                columns={disciplineColumns}
                dataSource={playersWithCards}
                rowKey="id"
                loading={loading}
                pagination={false}
              />
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
}
