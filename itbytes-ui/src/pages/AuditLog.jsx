import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button, Space, Spin, message as antdMessage } from "antd";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import AuditService from "../services/AuditService";


const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch audit‑log data
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const auditLogs = await AuditService.getAuditLogs();
      console.log("Fetched Audit Logs:", auditLogs);
      // ensure array & give every row a key
      const shaped = Array.isArray(auditLogs)
        ? auditLogs.map((row, i) => ({ key: i, ...row }))
        : [];
      setLogs(shaped);
    } catch (err) {
      antdMessage.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Convert rows → CSV and trigger file download
  const exportCSV = () => {
    if (!logs.length) return;
    const headers = ["Action", "From", "Status", "Message"];
    const csvRows = logs.map(
      ({ action, from, status, message }) =>
        `"${action}","${from}","${status}","${message.replace(/"/g, '""')}"`
    );
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "audit-log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Column definitions
  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // render: (status) => {
      //   const color =
      //     status === "success"
      //       ? "green"
      //       : status === "failed"
      //         ? "volcano"
      //         : "processing";
      //   return <Tag color={color}>{status.toUpperCase()}</Tag>;
      // },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
  ];

  return (
    <div style={{ padding: "0 35px", background: "#f9f9f9" }}>
      <h1 style={{ marginBottom: -5 }}>Audit Log</h1>
      <p style={{ marginBottom: 16 }}>
        View a detailed log of all actions performed in the system, including user activities, status changes
        , and messages for easy tracking and auditing.
      </p>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchLogs}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportCSV}
          disabled={!logs.length}
        >
          Export CSV
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={logs}
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      </Spin>
    </div>
  );
};

export default AuditLog;
