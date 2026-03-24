import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { itemsAPI, remindersAPI } from "../services/api";
import { Search, Plus, Trash2, Clock, Edit2 } from "lucide-react";

const GroceryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const query = searchQuery.toLowerCase();

    setFilteredItems(
      items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      ),
    );
  };

  const openDeleteModal = (item) => {
    setSelectedDelete(item);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await itemsAPI.delete(selectedDelete._id);
      setItems((prev) =>
        prev.filter((item) => item._id !== selectedDelete._id),
      );
      setDeleteModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openReminderModal = (item) => {
    setSelectedItem(item);
    setReminderDate("");
    setReminderMessage("");
    setShowReminderModal(true);
  };

  const handleReminderSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem) return;

    try {
      const isoDate = new Date(reminderDate).toISOString();

      await remindersAPI.create({
        itemId: selectedItem._id,
        itemName: selectedItem.name,
        reminderDate: isoDate,
        message: reminderMessage,
      });

      setReminderDate("");
      setReminderMessage("");
      setSelectedItem(null);
      setShowReminderModal(false);
    } catch (error) {
      console.error("Failed to create reminder:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className="text-3xl font-bold text-gradient">
            {user?.firstName}'s Grocery List
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            {items.length} items tracked
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-border shadow-sm w-full">
          <Search size={18} className="text-muted-foreground" />

          <input
            placeholder="Search items..."
            className="bg-transparent outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link
          to="/add-item"
          className="absolute bottom-6 right-6 flex items-center rounded-full p-2 text-primary hover:bg-primary/30 hover:border hover:border-primary hover:text-white hover:scale-[1.15] transition duration-500"
          title="Add An Item"
        >
          <Plus size={28} />
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left table-fixed text-muted-foreground text-xs uppercase tracking-wide">
                <th className="pl-4">Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Added</th>
                <th>Expires</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className={`${item.status == "Expired" ? "bg-red-500/20 text-red-500 hover:text-red-700" : "bg-primary/20 text-primary"} glass glass-strong shadow-sm hover:shadow-md transition rounded-xl text-primary hover:text-foreground`}
                >
                  <td className="p-4 font-medium rounded-l-xl">{item.name}</td>

                  <td>
                    <span className="py-1 ">{item.category}</span>
                  </td>

                  <td>{item.quantity}</td>

                  <td>{formatDate(item.purchaseDate)}</td>

                  <td>{formatDate(item.expiryDate)}</td>

                  <td className="rounded-r-xl pr-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/edit-item/${item._id}`)}
                        className="p-2 hover:scale-[1.15] transition-transofrm duration-500"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => openReminderModal(item)}
                        className="p-2 hover:scale-[1.15] transition-transofrm duration-500"
                      >
                        <Clock size={16} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(item)}
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
          <Plus size={70} className="opacity-40 mb-6" />
          <h3 className="text-lg font-semibold">No items</h3>
          <p className="text-sm">Start adding an item</p>
        </div>
      )}

      {/* REMINDER MODAL */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl space-y-5">
            <div className="flex gap-3">
              <Clock size={22} className="text-primary mt-0.75" />
              <div>
                <h2 className="text-lg font-semibold">Set Reminder</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedItem?.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full mt-1 border border-border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Message</label>

                <input
                  type="text"
                  placeholder="Optional message..."
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full mt-1 border border-border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  className="px-4 py-2 bg-white border border-border rounded-lg hover:scale-[1.02] transition duration-500 hover:shadow-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 background-gradient text-white rounded-lg hover:scale-[1.02] transition duration-500 hover:shadow-lg"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl">
            <h2 className="text-xl font-semibold mb-2">Delete Item</h2>

            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedDelete?.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-white border border-border rounded-lg hover:scale-[1.02] transition duration-500 hover:shadow-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-[1.02] transition duration-500 hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryList;
