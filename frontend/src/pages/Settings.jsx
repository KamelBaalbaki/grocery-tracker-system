import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Palette,
  LogOut,
  Trash2,
  Save,
  Check,
  Lock,
  Edit,
  TriangleAlert,
  X,
} from "lucide-react";
import { usersAPI } from "../services/api";

const Settings = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    defaultReminderDays: "3",
    theme: "dark",
  });

  const [saved, setSaved] = useState(false);

  // MODALS STATE
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // FORM STATES
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // ================= PROFILE UPDATE =================
  const handleProfileUpdate = async () => {
    try {
      console.log("USER:", user);
      const updated = await usersAPI.updateUser(user.userId, profileData);
      setUser(updated);
      setShowProfileModal(false);
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("RESPONSE:", err.response);
      console.error("DATA:", err.response?.data);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  // ================= PASSWORD UPDATE =================
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError("Passwords do not match");
    }

    try {
      await usersAPI.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to update password";
      setPasswordError(message);
    }
  };

  // ================= DELETE ACCOUNT =================
  const handleDeleteAccount = async () => {
    if (!window.confirm("This will permanently delete your account")) return;

    try {
      await usersAPI.deleteUser(user.userId);
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your preferences
        </p>
      </div>

      {/* SUCCESS */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
          <Check size={18} />
          Settings saved successfully!
        </div>
      )}

      {/* PROFILE */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="font-semibold">Profile</h2>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="text-sm px-5.5 py-2 rounded-lg 
                  bg-primary border text-white btn 
                  hover:bg-primary/20 hover:text-primary hover:border-primary transition"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>

          <div>
            <div className="font-semibold text-lg">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-primary" />
          <span className="font-medium">Password</span>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="text-sm px-3 py-2 rounded-lg 
                  bg-primary border text-white btn 
                  hover:bg-primary/20 hover:text-primary hover:border-primary transition"
        >
          Change
        </button>
      </div>

      {/* DELETE */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TriangleAlert size={20} className="text-red-500" />
          <span className="text-red-500 font-medium">Danger</span>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-sm px-3 py-2 rounded-lg 
                  bg-red-500 border text-white btn 
                  hover:bg-red-500/20 hover:text-red-500 hover:border-red-500 transition"
        >
          Delete Account
        </button>
      </div>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-primary/20 glass glass-strong rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between">
              <h2 className="font-semibold">Edit Profile</h2>
              <X
                onClick={() => setShowProfileModal(false)}
                className="cursor-pointer"
              />
            </div>
            <label className="block text-sm font-medium text-foreground mb-1">
              First Name
            </label>
            <input
              placeholder="First Name"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />

            <label className="block text-sm font-medium text-foreground mb-1">
              Last Name
            </label>
            <input
              placeholder="Last Name"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />

            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              placeholder="Email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />

            <button
              onClick={handleProfileUpdate}
              className="w-full p-2 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition duration-500 hover:shadow-xl"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-primary/20 glass glass-strong rounded-2xl p-6 w-full max-w-md space-y-4">
            {passwordError && (
              <p className="w-full text-start bg-red-500/80 rounded-xl p-4 text-white text-sm text-center">
                {passwordError}
              </p>
            )}
            <div className="flex justify-between">
              <h2 className="font-semibold">Change Password</h2>
              <X
                onClick={() => setShowPasswordModal(false)}
                className="cursor-pointer"
              />
            </div>

            <label className="block text-sm font-medium text-foreground mb-1">
              Old Password
            </label>
            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                });
                setPasswordError("");
              }}
              className="w-full p-2 border rounded-lg"
            />

            <label className="block text-sm font-medium text-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                });
                setPasswordError("");
              }}
              className="w-full p-2 border rounded-lg"
            />

            <label className="block text-sm font-medium text-foreground mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => {
                setPasswordData({
                  ...passwordData,
                 confirmPassword: e.target.value,
                });
                setPasswordError(""); // clear error while typing
              }}
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-center text-muted-foreground mt-2">
              Min 8 chars with uppercase, lowercase, number & special character
            </p>

            <button
              onClick={handlePasswordChange}
              className="w-full p-2 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition duration-500 hover:shadow-xl"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white glass glass-strong rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-semibold text-lg text-center">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white border border-border rounded-lg hover:scale-[1.02] transition duration-500 hover:shadow-lg"
              >
                No
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-[1.02] transition duration-500 hover:shadow-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
