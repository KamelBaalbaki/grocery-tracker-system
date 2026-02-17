import { useState, useEffect } from "react";
import { remindersAPI } from "../services/api";
import { Edit3, Trash2, Clock } from "lucide-react";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [reminderDate, setReminderDate] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const data = await remindersAPI.getAll();

      const sorted = data.sort(
        (a, b) => new Date(a.reminderDate) - new Date(b.reminderDate),
      );

      setReminders(sorted);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (reminder) => {
    setEditingId(reminder._id);

    setSelectedItem({
      name: reminder.itemName,
      id: reminder.itemId,
    });

    const toLocalInputFormat = (date) => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    };

    setReminderDate(toLocalInputFormat(reminder.reminderDate));

    setReminderMessage(reminder.message || "");

    setShowReminderModal(true);
  };

  const handleReminderSubmit = async (e) => {
    e.preventDefault();

    try {
      const isoDate = new Date(reminderDate).toISOString();

      await remindersAPI.update(editingId, {
        reminderDate: isoDate,
        message: reminderMessage,
      });

      await fetchReminders();

      setShowReminderModal(false);
      setEditingId(null);
      setSelectedItem(null);
      setReminderDate("");
      setReminderMessage("");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remindersAPI.delete(id);
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getCountdown = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;

    if (diff <= 0) return { text: "Due Now", color: "var(--danger)" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return { text: `${days}d ${hours}h`, color: "var(--warning)" };
    }

    return { text: `${hours}h`, color: "var(--danger)" };
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
        <h1 className="page-title">Reminders</h1>
        <p className="page-subtitle">Manage your item reminders</p>
      </div>

      <div className="table-container">
        {reminders.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Reminder Date</th>
                <th>Countdown</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {reminders.map((reminder) => {
                const countdown = getCountdown(reminder.reminderDate);

                return (
                  <tr key={reminder._id}>
                    <td>{reminder.itemName}</td>

                    <td>{new Date(reminder.reminderDate).toLocaleString()}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: countdown.color,
                          fontWeight: 600,
                        }}
                      >
                        <Clock size={14} />
                        {countdown.text}
                      </div>
                    </td>

                    <td>{reminder.status}</td>

                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="action-btn"
                        onClick={() => openEditModal(reminder)}
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(reminder._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Clock size={80} />
            <h3>No reminders yet</h3>
            <p>Reminders will appear here once created</p>
          </div>
        )}
      </div>

      {showReminderModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <div className="modal-header">
              <div className="modal-icon">
                <Clock size={20} />
              </div>
              <div>
                <h2>Edit Reminder</h2>
                <p>{selectedItem?.name}</p>
              </div>
            </div>

            <form onSubmit={handleReminderSubmit} className="modal-form">
              <div className="input-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Message (optional)</label>
                <input
                  type="text"
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowReminderModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Update Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
