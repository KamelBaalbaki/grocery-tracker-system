import { useState, useEffect } from "react";
import { notificationsAPI } from "../services/api";
import { Bell, CheckCircle, Trash2 } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();

      // Sort newest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setNotifications(sorted);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationsAPI.deleteAll();
      setNotifications([]);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="page-subtitle">
            Stay updated with your reminders and item alerts
          </p>

          {notifications.length > 0 && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="action-btn" onClick={markAllAsRead}>
                Mark All Read
              </button>
              <button
                className="action-btn delete"
                onClick={deleteAllNotifications}
              >
                Delete All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        {notifications.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification._id}
                  style={{
                    background: notification.isRead
                      ? "transparent"
                      : "rgba(0, 123, 255, 0.05)",
                  }}
                >
                  <td>
                    {notification.isRead ? (
                      <CheckCircle size={18} color="var(--success)" />
                    ) : (
                      <Bell size={18} color="var(--primary)" />
                    )}
                  </td>

                  <td style={{ fontWeight: 600 }}>{notification.title}</td>

                  <td>
                    {notification.message}
                    {notification.reminderDate && (
                      <span style={{ fontSize: ".9rem", opacity: 0.7 }}>
                        {new Date(notification.reminderDate).toLocaleString()}
                      </span>
                    )}
                  </td>

                  <td>{formatDate(notification.createdAt)}</td>

                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    {!notification.isRead && (
                      <button
                        className="action-btn"
                        onClick={() => markAsRead(notification._id)}
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}

                    <button
                      className="action-btn delete"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Bell size={80} />
            <h3>No notifications</h3>
            <p>You're all caught up 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
