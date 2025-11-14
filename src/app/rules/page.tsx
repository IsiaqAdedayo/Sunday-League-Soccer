"use client";

import Navigation from "../../components/Navigation";
import { Card, Divider } from "antd";
import { motion } from "framer-motion";
import {
  IoBook,
  IoCard,
  IoCash,
  IoFootball,
  IoTime,
  IoTrophy,
  IoRibbon,
  IoPeople,
} from "react-icons/io5";
import styles from "./rules.module.css";

export default function RulesPage() {
  const rules = [
    {
      icon: <IoTrophy />,
      title: "Tournament Format",
      content: [
        "Team with highest points by the end of the tournament wins",
        "Win = 3pts, Draw = 1pt, Loss = 0pts",
        "If goal difference is tied and can't determine the ultimate winner, 7-player PK follows (no hiding behind your best PK taker)",
      ],
    },
    {
      icon: <IoRibbon />,
      title: "Tournament Prizes",
      content: [
        "🏆 FIRST PLACE: ₦150,000",
        "⚽ HIGHEST GOAL SCORER: ₦5,000 (if tied, they play 3 PKs each)",
        "🎯 HIGHEST ASSIST: ₦5,000 (if tied, they play 3 PKs each)",
        "🛡️ HIGHEST CLEAN SHEET: ₦5,000 (no booking, no goal conceded - if tied, they play 3 PKs each) - Sponsored by SLS",
      ],
    },
    {
      icon: <IoTime />,
      title: "Match Timing",
      content: [
        "Kickoff is scheduled for 4:30 PM",
        "No new matches with 20 mins over 6:30 PM would be played",
        "May flexibly extend overall fixtures into 1st Sunday of December if needed (worst case scenario)",
        "Captains should align players accordingly so we don't need to play into darkness",
        "If you want to warm up or play OGO, come earlier & round up by 4-4:30 PM",
      ],
    },
    {
      icon: <IoPeople />,
      title: "Team Lateness & Forfeiture",
      content: [
        "Team lateness to organise players on pitch when other team is ready = forfeiture",
        "Once other team is complete on the pitch, after 5 minutes it's free 3 points, no stories",
        "Any team with less than 5 players once the opposing team is ready & on pitch = forfeiture",
        "5 players can kickoff for an incomplete team",
        "Fixtures have been pre-arranged so every team knows when they are playing",
      ],
    },
    {
      icon: <IoFootball />,
      title: "Match Rules",
      content: [
        "All normal SLS rules apply (foul throws, offside, corner touching trees, 2 balls out, any ball out, etc.)",
        "Shots bouncing off post bars without entering the net won't be counted - we don't have goal-line tech",
        "Referee shall make sole decisions, no consulting sideline players or spectators",
        "Where there are no neutral linesmen, only the referee's discretion shall be used and should be respected",
        "Only captains & assistants are allowed to complain to referee on behalf of their team on the pitch",
      ],
    },
    {
      icon: <IoCard />,
      title: "Discipline & Bookings",
      content: [
        "Yellow card = ₦1,000 fine",
        "Red card = ₦2,000 fine & misses following game",
        "Match interference from sidelines = ₦1,500 fine & one match ban",
        "Booked players suspended from playing following matches until bookings been paid for",
        "Declare booking payment confirmation to Admins or in group chat",
        "Any player causing match delays or indiscipline = straight ban from tournament (we no wan sabi if na your best player) or ₦15,000 pardon fine with public apology",
      ],
    },
    {
      icon: <IoCash />,
      title: "Payment Information",
      content: [
        "Account: 8260739275",
        "Name: UHRIHRIOGHENE AVBENAGHA",
        "Bank: Moniepoint MFB",
        "Declare booking payment confirmation to Admins or in group chat",
      ],
    },
    {
      icon: <IoBook />,
      title: "Match Officials & VAR",
      content: [
        "Relating with match officials off the pitch = instant disqualification",
        "Match officials are being paid by Admins only, no need to show love or appreciation",
        "Respect match officials' final decision on the pitch",
        "IF THERE IS VAR/VIDEO RECORDING, it is allowed for review against controversial decisions ASAP",
        "VAR review: Only with the ref & the respective captains & assistants on the pitch without delay",
        "Nobody is above errors",
      ],
    },
    {
      icon: <IoPeople />,
      title: "Guest Players & Team Balance",
      content: [
        "Guests (teamless players) can complete incomplete teams pre-match",
        "Where all teams are complete, we won't accept guests",
        "Choosing guests follows agreed captain order: 1. Trailblazers FC, 2. BB CF, 3. Inazuma FC, 4. Galacticos FC",
        "Any regular player that wants to join next shall complete Inazuma FC so all home teams would be balanced",
        "If home teams get more players in threes before Sunday, we share equally until each team maxes 12 players each",
      ],
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
          <h1 className={styles.title}>Tournament Rules</h1>
          <p className={styles.subtitle}>
            Sunday League Soccer Guidelines & Regulations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.rulesContainer}
        >
          {rules.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={styles.ruleCard}>
                <div className={styles.ruleHeader}>
                  <div className={styles.ruleIcon}>{section.icon}</div>
                  <h2 className={styles.ruleTitle}>{section.title}</h2>
                </div>
                <Divider className={styles.divider} />
                <ul className={styles.ruleList}>
                  {section.content.map((rule, ruleIndex) => (
                    <motion.li
                      key={ruleIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * ruleIndex }}
                      className={styles.ruleItem}
                    >
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={styles.footer}
        >
          <Card className={styles.footerCard}>
            <h3>Important Notes</h3>
            <p>
              All captains and assistant captains are 100% responsible for
              coordinating their teams on pitch. IQ can update the score sheets
              & team points via the Google Sheets. Both admins also have access
              to edit. Respect match officials' final decisions. Let's maintain
              sportsmanship and enjoy the beautiful game!
            </p>
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "8px",
								border: '2px solid #ffffff19',
              }}
            >
              <strong>Google Sheets Link:</strong>
              <br />
              <a
                href="https://docs.google.com/spreadsheets/d/14VllK0s8bE6DUNcSx7FOEMTTnlpK9tg0UjIJehwEVzM/edit?usp=drivesdk"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1890ff", wordBreak: "break-all" }}
              >
                View Tournament Tracker (View Only)
              </a>
            </div>
          </Card>
        </motion.div>
      </main>
    </>
  );
}
