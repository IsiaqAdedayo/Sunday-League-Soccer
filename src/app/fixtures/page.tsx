"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, Badge, Tabs, Empty } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navigation from "@/components/Navigation";
import { Fixture } from "../../../types";
import styles from "./fixtures.module.css";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const snapshot = await getDocs(collection(db, "fixtures"));
      let fixturesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Fixture[];

      // Sort fixtures: Latest matchday first, then latest time first
      fixturesData.sort((a, b) => {
        // First sort by matchday descending (latest matchday first)
        if (a.matchday !== b.matchday) return a.matchday - b.matchday;

        // Then sort by time if available (latest time first)
        if (a.time && b.time) {
          const getTimeValue = (timeStr: string) => {
            try {
              // Get the first time in the range (e.g., "4:15 - 4:35 PM" -> "4:15")
              const firstTime = timeStr.split("-")[0].trim();
              const isPM = timeStr.toUpperCase().includes("PM");
              const [hours, minutes] = firstTime
                .split(":")
                .map((s) => parseInt(s.replace(/\D/g, "")));
              let hour24 = hours;

              // Convert to 24-hour format
              if (isPM && hour24 !== 12) hour24 += 12;
              if (!isPM && hour24 === 12) hour24 = 0;

              return hour24 * 60 + (minutes || 0);
            } catch (e) {
              return 0;
            }
          };

          return getTimeValue(a.time) - getTimeValue(b.time); // Latest time first
        }

        return 0;
      });

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
            defaultActiveKey={
              Object.keys(groupedFixtures).sort(
                (a, b) => Number(a) - Number(b)
              )[0]
            }
            items={Object.keys(groupedFixtures)
              .sort((a, b) => Number(a) - Number(b)) // Latest matchday first
              .map((matchday) => ({
                key: matchday,
                label: `Matchday ${matchday}`,
                children: (
                  <div className={styles.fixturesGrid}>
                    {groupedFixtures[Number(matchday)].map((fixture: any) => (
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
