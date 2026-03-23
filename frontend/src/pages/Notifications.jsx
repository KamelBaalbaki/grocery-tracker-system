import { useState, useEffect } from "react";
import { notificationsAPI } from "../services/api";
import { Bell, CheckCircle, Trash2, CheckCheck } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();

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

  const formatDate = (date) => new Date(date).toLocaleString();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        className="absolute bottom-14 right-6 flex items-center rounded-full p-2 text-primary hover:scale-[1.15] hover:bg-primary/30 hover:border hover:border-primary hover:text-white transition duration-500"
        onClick={markAllAsRead}
        title="Mark All As Read"
      >
        <CheckCheck size={28} />
      </button>

      <button
        className="absolute bottom-0 right-6 flex items-center rounded-full p-2 text-primary hover:scale-[1.15] hover:bg-primary/30 hover:border hover:border-primary hover:text-red-500 transition duration-500"
        onClick={deleteAllNotifications}
        title="Delete All Notifications"
      >
        <Trash2 size={28} />
      </button>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Notifications</h1>

          <p className="text-muted-foreground text-sm mt-1">
            {notifications.length} notifications
          </p>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left table-fixed text-muted-foreground text-xs uppercase tracking-wide">
                <th className="pl-4">Status</th>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification._id}
                  className={`shadow-sm text-primary hover:shadow-md hover:text-foreground rounded-xl
                  ${notification.isRead ? "bg-white" : "bg-primary/80 glass glass-strong"}`}
                >
                  <td className="p-4 rounded-l-xl">
                    {notification.isRead ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Bell size={18} />
                    )}
                  </td>

                  <td className="font-medium">{notification.title}</td>

                  <td className="text-muted-foreground">
                    {notification.message}

                    {notification.reminderDate && (
                      <div className="text-xs text-primary mt-1">
                        {new Date(notification.reminderDate).toLocaleString()}
                      </div>
                    )}
                  </td>

                  <td className="text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </td>

                  <td className="rounded-r-xl pr-6">
                    <div className="flex justify-end gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-2 hover:scale-[1.15] transition-transofrm duration-500"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-2 hover:scale-[1.15] transition-transofrm duration-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bell size={70} className="opacity-40 mb-6" />
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="text-sm">You're all caught up</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
