import React, { useState, useEffect } from "react";
import { Typography, List, Button, Tag, Badge } from "antd";

const { Title } = Typography;

const apis = [
  {
    name: "User API",
    url: import.meta.env.VITE_USER_API_URL,
  },
  {
    name: "Inventory API",
    url: import.meta.env.VITE_INVENTORY_API_URL,
  },
  {
    name: "Order API",
    url: import.meta.env.VITE_ORDER_API_URL,
  },
];

const Test = () => {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(false);

  const checkApis = async () => {
    setLoading(true);
    const newStatuses = {};

    await Promise.all(
      apis.map(async (api) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          await fetch(api.url, { method: "GET", mode: "no-cors", signal: controller.signal });
          clearTimeout(timeout);
          newStatuses[api.name] = true;
        } catch {
          newStatuses[api.name] = false;
        }
      })
    );

    setStatuses(newStatuses);
    setLoading(false);
  };

  useEffect(() => {
    checkApis(); // Run once on mount
  }, []);

  return (
    <div style={{ padding: 32, fontFamily: "Poppins, sans-serif" }}>
      <Title level={3}>API Status Monitor</Title>

      <Button
        onClick={checkApis}
        loading={loading}
        style={{ marginBottom: 20, borderRadius: 6 }}
        type="primary"
      >
        Refresh Status
      </Button>

      <List
        bordered
        dataSource={apis}
        renderItem={(api) => (
          <List.Item>
            <strong>{api.name}</strong>
            <Badge
              style={{ fontFamily: 'Poppins' }}
              status={statuses[api.name] ? "success" : "error"}
              text={statuses[api.name] ? "Connected" : "Disconnected"}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Test;
