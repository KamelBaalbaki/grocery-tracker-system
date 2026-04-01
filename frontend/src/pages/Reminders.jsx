import { useState, useEffect } from "react";
import { remindersAPI } from "../services/api";
import { Edit2, Trash2, Clock } from "lucide-react";

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
        (b, a) => new Date(b.reminderDate) - new Date(a.reminderDate),
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

    const d = new Date(reminder.reminderDate);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setReminderDate(d.toISOString().slice(0, 16));

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

    if (diff <= 0) return { text: "Due Now", color: "text-red-500" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return { text: `${days}d ${hours}h`, color: "text-yellow-500" };
    }

    return { text: `${hours}h`, color: "text-red-500" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Reminders</h1>

          <p className="text-muted-foreground text-sm mt-1">
            {reminders.length} reminders scheduled
          </p>
        </div>
      </div>

      {reminders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left table-fixed text-muted-foreground text-xs uppercase tracking-wide">
                <th className="pl-4">Item</th>
                <th>Reminder Date</th>
                <th>Countdown</th>
                <th>Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reminders.map((reminder) => {
                const countdown = getCountdown(reminder.reminderDate);

                return (
                  <tr
                    key={reminder._id}
                    className="bg-primary/20 glass glass-strong shadow-sm text-primary hover:shadow-md hover:text-foreground transition rounded-xl"
                  >
                    <td className="p-4 font-medium rounded-l-xl">
                      {reminder.itemName}
                    </td>

                    <td>{new Date(reminder.reminderDate).toLocaleString()}</td>

                    <td>
                      <div
                        className={`flex items-center gap-2 font-semibold ${countdown.color}`}
                      >
                        <Clock size={14} />
                        {countdown.text}
                      </div>
                    </td>

                    <td>{reminder.status}</td>

                    <td className="rounded-r-xl pr-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(reminder)}
                          className="p-2 hover:scale-[1.15] transition-transofrm duration-500"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(reminder._id)}
                          className="p-2 hover:scale-[1.15] transition-transofrm duration-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Clock size={70} className="opacity-40 mb-6" />

          <h3 className="text-lg font-semibold">No reminders yet</h3>

          <p className="text-sm">Reminders will appear here once created</p>
        </div>
      )}

      {/* EDIT MODAL */}

      {showReminderModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-6">
            <div className="flex items-start gap-3">
              <Clock size={22} className="text-primary" />

              <div>
                <h2 className="text-lg font-semibold">Edit Reminder</h2>

                <p className="text-sm text-muted-foreground">
                  {selectedItem?.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Date & Time</label>

                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  className="w-full border border-border rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Message (optional)
                </label>

                <input
                  type="text"
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:scale-[1.02] transition duration-500 hover:shadow-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg background-gradient text-white hover:scale-[1.02] transition duration-500 hover:shadow-xl"
                >
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
