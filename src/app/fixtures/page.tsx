"use client";

import Navigation from "../../components/Navigation";
import { db } from "../../lib/firebase";
import { Fixture } from "../../../types";
import { Badge, Card, Empty, Tabs } from "antd";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./fixtures.module.css";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const q = query(collection(db, "fixtures"), orderBy("matchday", "asc"));
      const snapshot = await getDocs(q);
      const fixturesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Fixture[];
      setFixtures(fixturesData);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByMatchday = (fixtures: Fixture[]) => {
    return fixtures.reduce(
      (acc, fixture) => {
        if (!acc[fixture.matchday]) {
          acc[fixture.matchday] = [];
        }
        acc[fixture.matchday].push(fixture);
        return acc;
      },
      {} as Record<number, Fixture[]>
    );
  };

  const groupedFixtures = groupByMatchday(fixtures);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "default", text: "Scheduled" },
      live: { color: "success", text: "LIVE" },
      finished: { color: "processing", text: "Finished" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;
    return <Badge status={config.color as any} text={config.text} />;
  };

  const FixtureCard = ({ fixture }: { fixture: Fixture }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={styles.fixtureCard}>
        <div className={styles.fixtureHeader}>
          <span className={styles.matchTime}>
            {fixture.date} - {fixture.time}
          </span>
          {getStatusBadge(fixture.status)}
        </div>
        <div className={styles.fixtureBody}>
          <div className={styles.team}>
            <span className={styles.teamName}>{fixture.homeTeam}</span>
            {fixture.status === "finished" && (
              <span className={styles.score}>{fixture.homeScore}</span>
            )}
          </div>
          <div className={styles.versus}>VS</div>
          <div className={styles.team}>
            {fixture.status === "finished" && (
              <span className={styles.score}>{fixture.awayScore}</span>
            )}
            <span className={styles.teamName}>{fixture.awayTeam}</span>
          </div>
        </div>
      </Card>
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
          <h1 className={styles.title}>Fixtures & Results</h1>
          <p className={styles.subtitle}>All tournament matches</p>
        </motion.div>

        {loading ? (
          <div className={styles.loading}>Loading fixtures...</div>
        ) : Object.keys(groupedFixtures).length === 0 ? (
          <Empty description="No fixtures scheduled yet" />
        ) : (
          <Tabs
            defaultActiveKey="1"
            items={Object.keys(groupedFixtures).map((matchday) => ({
              key: matchday,
              label: `Matchday ${matchday}`,
              children: (
                <div className={styles.fixturesGrid}>
                  {groupedFixtures[Number(matchday)].map((fixture) => (
                    <FixtureCard key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              ),
            }))}
            className={styles.tabs}
          />
        )}
      </main>
    </>
  );
}
