"use client";

import { db } from "../../../lib/firebase";
import { Booking, Fixture, Player, Team } from "../../../../types";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tabs,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoAdd,
  IoCreate,
  IoFootball,
  IoLogOut,
  IoTrash,
} from "react-icons/io5";
import styles from "./dashboard.module.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "team" | "fixture" | "player" | "booking"
  >("team");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [teamsSnap, fixturesSnap, playersSnap, bookingsSnap] =
        await Promise.all([
          getDocs(collection(db, "teams")),
          getDocs(collection(db, "fixtures")),
          getDocs(collection(db, "players")),
          getDocs(collection(db, "bookings")),
        ]);

      setTeams(
        teamsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Team)
      );
      setFixtures(
        fixturesSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Fixture
        )
      );
      setPlayers(
        playersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Player)
      );
      setBookings(
        bookingsSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Booking
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  const openModal = (type: typeof modalType, item?: any) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await updateDoc(doc(db, getCollectionName(), editingItem.id), values);
        message.success("Updated successfully!");
      } else {
        await addDoc(collection(db, getCollectionName()), values);
        message.success("Added successfully!");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
      fetchAllData();
    } catch (error) {
      console.error("Error saving:", error);
      message.error("Failed to save");
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      message.success("Deleted successfully!");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting:", error);
      message.error("Failed to delete");
    }
  };

  const getCollectionName = () => {
    const map = {
      team: "teams",
      fixture: "fixtures",
      player: "players",
      booking: "bookings",
    };
    return map[modalType];
  };

  const recalculateStandings = async () => {
    try {
      const finishedFixtures = fixtures.filter((f) => f.status === "finished");

      const teamStats: Record<string, Team> = {};
      teams.forEach((team) => {
        teamStats[team.name] = {
          ...team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      });

      finishedFixtures.forEach((fixture) => {
        const homeTeam = teamStats[fixture.homeTeam];
        const awayTeam = teamStats[fixture.awayTeam];

        if (homeTeam && awayTeam) {
          homeTeam.played++;
          awayTeam.played++;
          homeTeam.goalsFor += fixture.homeScore || 0;
          homeTeam.goalsAgainst += fixture.awayScore || 0;
          awayTeam.goalsFor += fixture.awayScore || 0;
          awayTeam.goalsAgainst += fixture.homeScore || 0;

          if (fixture.homeScore! > fixture.awayScore!) {
            homeTeam.won++;
            homeTeam.points += 3;
            awayTeam.lost++;
          } else if (fixture.homeScore! < fixture.awayScore!) {
            awayTeam.won++;
            awayTeam.points += 3;
            homeTeam.lost++;
          } else {
            homeTeam.drawn++;
            awayTeam.drawn++;
            homeTeam.points += 1;
            awayTeam.points += 1;
          }
        }
      });

      for (const teamName in teamStats) {
        const team = teamStats[teamName];
        team.goalDifference = team.goalsFor - team.goalsAgainst;
        await updateDoc(doc(db, "teams", team.id), team);
      }

      message.success("Standings recalculated successfully!");
      fetchAllData();
    } catch (error) {
      console.error("Error recalculating standings:", error);
      message.error("Failed to recalculate standings");
    }
  };

  // Team Columns
  const teamColumns: ColumnsType<Team> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Short Name", dataIndex: "shortName", key: "shortName" },
    { title: "P", dataIndex: "played", key: "played", width: 60 },
    { title: "W", dataIndex: "won", key: "won", width: 60 },
    { title: "D", dataIndex: "drawn", key: "drawn", width: 60 },
    { title: "L", dataIndex: "lost", key: "lost", width: 60 },
    { title: "Pts", dataIndex: "points", key: "points", width: 60 },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Team) => (
        <div className={styles.actions}>
          <Button
            type="link"
            icon={<IoCreate />}
            onClick={() => openModal("team", record)}
          />
          <Popconfirm
            title="Delete this team?"
            onConfirm={() => handleDelete(record.id, "teams")}
          >
            <Button type="link" danger icon={<IoTrash />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Fixture Columns
  const fixtureColumns: ColumnsType<Fixture> = [
    { title: "Matchday", dataIndex: "matchday", key: "matchday", width: 100 },
    { title: "Home Team", dataIndex: "homeTeam", key: "homeTeam" },
    {
      title: "Score",
      key: "score",
      render: (_: any, record: Fixture) =>
        record.status === "finished"
          ? `${record.homeScore} - ${record.awayScore}`
          : "-",
    },
    { title: "Away Team", dataIndex: "awayTeam", key: "awayTeam" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className={styles[`status-${status}`]}>
          {status?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Fixture) => (
        <div className={styles.actions}>
          <Button
            type="link"
            icon={<IoCreate />}
            onClick={() => openModal("fixture", record)}
          />
          <Popconfirm
            title="Delete this fixture?"
            onConfirm={() => handleDelete(record.id, "fixtures")}
          >
            <Button type="link" danger icon={<IoTrash />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Player Columns
  const playerColumns: ColumnsType<Player> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Team", dataIndex: "team", key: "team" },
    { title: "Position", dataIndex: "position", key: "position", width: 100 },
    { title: "Goals", dataIndex: "goals", key: "goals", width: 80 },
    { title: "Assists", dataIndex: "assists", key: "assists", width: 80 },
    {
      title: "Clean Sheets",
      dataIndex: "cleanSheets",
      key: "cleanSheets",
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Player) => (
        <div className={styles.actions}>
          <Button
            type="link"
            icon={<IoCreate />}
            onClick={() => openModal("player", record)}
          />
          <Popconfirm
            title="Delete this player?"
            onConfirm={() => handleDelete(record.id, "players")}
          >
            <Button type="link" danger icon={<IoTrash />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <div className={styles.headerLeft}>
          <IoFootball className={styles.logo} />
          <div>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Manage SLS Tournament</p>
          </div>
        </div>
        <Button
          type="primary"
          danger
          icon={<IoLogOut />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </motion.div>

      <Tabs
        defaultActiveKey="teams"
        items={[
          {
            key: "teams",
            label: "Teams",
            children: (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <Button
                    type="primary"
                    icon={<IoAdd />}
                    onClick={() => openModal("team")}
                  >
                    Add Team
                  </Button>
                </div>
                <Table
                  columns={teamColumns}
                  dataSource={teams}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            key: "fixtures",
            label: "Fixtures",
            children: (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <Button
                    type="primary"
                    icon={<IoAdd />}
                    onClick={() => openModal("fixture")}
                  >
                    Add Fixture
                  </Button>
                  <Button onClick={recalculateStandings}>
                    Recalculate Standings
                  </Button>
                </div>
                <Table
                  columns={fixtureColumns}
                  dataSource={fixtures}
                  rowKey="id"
                  loading={loading}
                />
              </div>
            ),
          },
          {
            key: "players",
            label: "Players",
            children: (
              <div className={styles.tabContent}>
                <div className={styles.tabHeader}>
                  <Button
                    type="primary"
                    icon={<IoAdd />}
                    onClick={() => openModal("player")}
                  >
                    Add Player
                  </Button>
                </div>
                <Table
                  columns={playerColumns}
                  dataSource={players}
                  rowKey="id"
                  loading={loading}
                />
              </div>
            ),
          },
        ]}
        className={styles.tabs}
      />

      <Modal
        title={`${editingItem ? "Edit" : "Add"} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          {modalType === "team" && (
            <>
              <Form.Item
                name="name"
                label="Team Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="shortName"
                label="Short Name"
                rules={[{ required: true }]}
              >
                <Input maxLength={3} />
              </Form.Item>
            </>
          )}

          {modalType === "fixture" && (
            <>
              <Form.Item
                name="matchday"
                label="Matchday"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="homeTeam"
                label="Home Team"
                rules={[{ required: true }]}
              >
                <Select>
                  {teams.map((team) => (
                    <Select.Option key={team.id} value={team.name}>
                      {team.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="awayTeam"
                label="Away Team"
                rules={[{ required: true }]}
              >
                <Select>
                  {teams.map((team) => (
                    <Select.Option key={team.id} value={team.name}>
                      {team.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <Input placeholder="e.g., Nov 24, 2024" />
              </Form.Item>
              <Form.Item name="time" label="Time" rules={[{ required: true }]}>
                <Input placeholder="e.g., 4:30 PM" />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="scheduled">Scheduled</Select.Option>
                  <Select.Option value="live">Live</Select.Option>
                  <Select.Option value="finished">Finished</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="homeScore" label="Home Score">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="awayScore" label="Away Score">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}

          {modalType === "player" && (
            <>
              <Form.Item
                name="name"
                label="Player Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="team" label="Team" rules={[{ required: true }]}>
                <Select>
                  {teams.map((team) => (
                    <Select.Option key={team.id} value={team.name}>
                      {team.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="GK">GK</Select.Option>
                  <Select.Option value="DEF">DEF</Select.Option>
                  <Select.Option value="MID">MID</Select.Option>
                  <Select.Option value="FWD">FWD</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="goals" label="Goals" initialValue={0}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="assists" label="Assists" initialValue={0}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="cleanSheets"
                label="Clean Sheets"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="yellowCards"
                label="Yellow Cards"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="redCards" label="Red Cards" initialValue={0}>
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
