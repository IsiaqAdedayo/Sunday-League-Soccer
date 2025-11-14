"use client";

import Navigation from "../../components/Navigation";
import { db } from "../../lib/firebase";
import { Team } from "../../../types";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoTrophy } from "react-icons/io5";
import styles from "./standings.module.css";

export default function StandingsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "teams"));
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];

      // Sort by points, then goal difference, then goals for
      teamsData.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference)
          return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching standings:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Team> = [
    {
      title: "Pos",
      key: "position",
      width: 70,
      align: "center",
      render: (_: any, __: Team, index: number) => (
        <div className={styles.position}>
          {index === 0 && <IoTrophy className={styles.trophy} />}
          <span className={index === 0 ? styles.firstPlace : ""}>
            {index + 1}
          </span>
        </div>
      ),
    },
    {
      title: "Team",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Team, index: number) => (
        <span className={index === 0 ? styles.firstPlace : styles.teamName}>
          {name}
        </span>
      ),
    },
    {
      title: "P",
      dataIndex: "played",
      key: "played",
      width: 70,
      align: "center",
    },
    {
      title: "W",
      dataIndex: "won",
      key: "won",
      width: 70,
      align: "center",
    },
    {
      title: "D",
      dataIndex: "drawn",
      key: "drawn",
      width: 70,
      align: "center",
    },
    {
      title: "L",
      dataIndex: "lost",
      key: "lost",
      width: 70,
      align: "center",
    },
    {
      title: "GF",
      dataIndex: "goalsFor",
      key: "goalsFor",
      width: 70,
      align: "center",
    },
    {
      title: "GA",
      dataIndex: "goalsAgainst",
      key: "goalsAgainst",
      width: 70,
      align: "center",
    },
    {
      title: "GD",
      dataIndex: "goalDifference",
      key: "goalDifference",
      width: 70,
      align: "center",
      render: (gd: number) => (
        <span
          className={gd > 0 ? styles.positive : gd < 0 ? styles.negative : ""}
        >
          {gd > 0 ? "+" : ""}
          {gd}
        </span>
      ),
    },
    {
      title: "Pts",
      dataIndex: "points",
      key: "points",
      width: 80,
      align: "center",
      render: (points: number, _: Team, index: number) => (
        <span className={index === 0 ? styles.pointsFirst : styles.points}>
          {points}
        </span>
      ),
    },
  ];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>League Standings</h1>
          <p className={styles.subtitle}>Tournament Table</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.tableContainer}
        >
          <Table
            columns={columns}
            dataSource={teams}
            rowKey="id"
            loading={loading}
            pagination={false}
            className={styles.table}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={styles.legend}
        >
          <h3>Key</h3>
          <div className={styles.legendItems}>
            <div>
              <strong>P</strong> - Played
            </div>
            <div>
              <strong>W</strong> - Won
            </div>
            <div>
              <strong>D</strong> - Drawn
            </div>
            <div>
              <strong>L</strong> - Lost
            </div>
            <div>
              <strong>GF</strong> - Goals For
            </div>
            <div>
              <strong>GA</strong> - Goals Against
            </div>
            <div>
              <strong>GD</strong> - Goal Difference
            </div>
            <div>
              <strong>Pts</strong> - Points
            </div>
          </div>
          <div className={styles.scoring}>
            <h4>Scoring System</h4>
            <p>Win = 3 points | Draw = 1 point | Loss = 0 points</p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
