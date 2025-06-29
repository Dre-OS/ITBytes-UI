import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic } from "antd";
import { Pie, Column } from "@ant-design/charts";

const apiUrl = import.meta.env.VITE_USER_API_URL;

const UserInsights = () => {
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState([]);
  const [authCounts, setAuthCounts] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [recentUser, setRecentUser] = useState(null);
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/all`);
      setUsers(data);

      const adminCount = users.filter(user => user.role === "admin").length;
      const recentUser = users.reduce((latest, user) =>
        new Date(user.createdAt) > new Date(latest.createdAt) ? user : latest, users[0] || {}
      );
      setAdminCount(adminCount);
      setRecentUser(recentUser);

      // Role counts
      const roles = data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      const rolePieData = Object.keys(roles).map((role) => ({
        type: role.charAt(0).toUpperCase() + role.slice(1),
        value: roles[role],
      }));
      setRoleCounts(rolePieData);

      // Authorization status counts
      const authStatus = data.reduce((acc, user) => {
        acc[user.isAuth] = (acc[user.isAuth] || 0) + 1;
        return acc;
      }, {});
      const authPieData = Object.keys(authStatus).map((status) => ({
        type: status.charAt(0).toUpperCase() + status.slice(1),
        value: authStatus[status],
      }));
      setAuthCounts(authPieData);

      // Active/Inactive counts
      const status = { active: 0, inactive: 0 };
      data.forEach((user) => {
        if (user.isDeleted) status.inactive++;
        else status.active++;
      });
      const statusData = Object.keys(status).map((s) => ({
        type: s.charAt(0).toUpperCase() + s.slice(1),
        value: status[s],
      }));
      setStatusCounts(statusData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic style={{ fontFamily: 'Poppins' }}
              valueStyle={{ fontSize: '16px', fontFamily: 'Poppins', fontWeight: 600 }}
              title="Total Users" value={users.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              style={{ fontFamily: 'Poppins' }}
              valueStyle={{ fontSize: '16px', fontFamily: 'Poppins', fontWeight: 600 }}
              title="Most Common Role"
              value={
                roleCounts.length > 0
                  ? roleCounts.reduce((a, b) => (a.value > b.value ? a : b)).type
                  : "-"
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              style={{ fontFamily: 'Poppins' }}
              valueStyle={{ fontSize: '16px', fontFamily: 'Poppins', fontWeight: 600 }}
              title="Total Admins"
              value={adminCount}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              style={{ fontFamily: 'Poppins' }}
              valueStyle={{ fontSize: '16px', fontWeight: 600 }}
              title="Most Recent User"
              value={recentUser?.firstName ? `${recentUser.firstName} ${recentUser.lastName}` : "-"}
            />
          </Card>
        </Col>

      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Card title="User Distribution by Role" style={{ height: 360 }}>
            <Pie
              style={{ fontFamily: 'Poppins' }}
              height={250}
              data={roleCounts}
              angleField="value"
              colorField="type"
              radius={1}
              label={{ type: "spider" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="User Authorization Status" style={{ height: 360 }}>
            <Pie
              style={{ fontFamily: 'Poppins' }}
              height={250}
              data={authCounts}
              angleField="value"
              colorField="type"
              radius={1}
              label={{ type: "spider" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="User Account Status (Active/Inactive)" style={{ height: 360 }}>
            <Pie
              style={{ fontFamily: 'Poppins' }}
              height={250}
              data={statusCounts}
              angleField="value"
              colorField="type"
              radius={1}
              label={{ type: "spider" }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default UserInsights;
