'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { IoFootball, IoTrophy, IoCalendar, IoStatsChart, IoBook } from 'react-icons/io5';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const items: MenuProps['items'] = [
    {
      key: '/',
      icon: <IoFootball size={20} />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: '/fixtures',
      icon: <IoCalendar size={20} />,
      label: <Link href="/fixtures">Fixtures</Link>,
    },
    {
      key: '/standings',
      icon: <IoTrophy size={20} />,
      label: <Link href="/standings">Standings</Link>,
    },
    {
      key: '/stats',
      icon: <IoStatsChart size={20} />,
      label: <Link href="/stats">Stats</Link>,
    },
    {
      key: '/rules',
      icon: <IoBook size={20} />,
      label: <Link href="/rules">Rules</Link>,
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.nav}
    >
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.logo}
        >
          <IoFootball size={32} />
          <span>SLS</span>
        </motion.div>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname || '/']}
          items={items}
          className={styles.menu}
        />
      </div>
    </motion.nav>
  );
}
