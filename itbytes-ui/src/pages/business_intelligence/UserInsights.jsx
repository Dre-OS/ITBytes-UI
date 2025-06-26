import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Statistic } from "antd";
import { Pie } from "@ant-design/charts";

const apiUrl = import.meta.env.VITE_USER_API_URL;

const UserInsights = () => {
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(apiUrl);
      setUsers(data);

      const counts = data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const pieData = Object.keys(counts).map((role) => ({
        type: role.charAt(0).toUpperCase() + role.slice(1),
        value: counts[role],
      }));

      setRoleCounts(pieData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  return (
    <div>
      <h2>User Insights</h2>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Users" value={users.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Most Common Role"
              value={
                roleCounts.length > 0
                  ? roleCounts.reduce((a, b) => (a.value > b.value ? a : b)).type
                  : "-"
              }
            />
          </Card>
        </Col>
      </Row>

      <Card title="User Distribution by Role">
        <Pie
          data={roleCounts}
          angleField="value"
          colorField="type"
          radius={1}
          label={{ type: "spider" }}
          interactions={[{ type: "element-active" }]}
        />
      </Card>
    </div>
  );
};

export default UserInsights;
