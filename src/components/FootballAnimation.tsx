'use client';

import { motion } from 'framer-motion';
import styles from './FootballAnimation.module.css';

export default function FootballAnimation() {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.ball}
        animate={{
          x: [0, 100, 200, 300, 200, 100, 0],
          y: [0, -50, -80, -50, -80, -50, 0],
          rotate: [0, 180, 360, 540, 720, 900, 1080],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ⚽
      </motion.div>
    </div>
  );
}
