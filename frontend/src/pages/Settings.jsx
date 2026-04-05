import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Check, Lock, TriangleAlert, X } from "lucide-react";
import { usersAPI, authAPI } from "../services/api";

const Settings = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  // MODALS STATE
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // FORM STATES
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [countdown, setCountdown] = useState(null);

  // ================= PROFILE UPDATE =================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await usersAPI.updateUser(user.userId, profileData);
      setUser(updated);
      setShowProfileModal(false);
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("RESPONSE:", err.response);
      console.error("DATA:", err.response?.data);
      alert(err.response?.data?.message || "Failed to update profile");
    }
    setLoading(false);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    setLoading(true);

    try {
      await usersAPI.requestEmailChange({
        newEmail: emailData.newEmail,
        password: emailData.password,
      });

      setEmailData({
        newEmail: "",
        password: "",
      });

      setCountdown(3);
      setEmailSuccess("Verification email sent! Logging out in 3...");

      let counter = 3;

      const interval = setInterval(async () => {
        counter--;

        if (counter > 0) {
          setCountdown(counter);
          setEmailSuccess(
            `Verification email sent! Logging out in ${counter}...`,
          );
        } else {
          clearInterval(interval);

          navigate("/verify-email-notice");

          setTimeout(() => {
            logout();
          }, 100);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to request email change";
      setEmailError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // ✅ reset states
    setPasswordError("");
    setPasswordSuccess("");

    // ✅ validate first
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await usersAPI.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      // ✅ show success first (keep modal open)
      setCountdown(3);
      setPasswordSuccess("Password updated successfully! Returning in 3...");

      let counter = 3;

      const interval = setInterval(() => {
        counter--;

        if (counter > 0) {
          setCountdown(counter);
          setPasswordSuccess(
            `Password updated successfully! Returning in ${counter}...`,
          );
        } else {
          clearInterval(interval);

          // ✅ close modal AFTER countdown
          setShowPasswordModal(false);

          // ✅ reset form
          setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          setPasswordSuccess("");
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to update password";
      setPasswordError(message);
    } finally {
      setLoading(false);
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
            className="text-sm px-5.5 py-2 btn rounded-lg background-gradient text-white hover:bg-foreground/90 transition duration-300"
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
            <div className="text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          <span className="text-muted-foreground">{user?.email}</span>
        </div>

        <button
          onClick={() => setShowEmailModal(true)}
          className="text-sm px-3 py-2 btn rounded-lg background-gradient text-white hover:bg-foreground/90 transition duration-300"
        >
          Change
        </button>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-primary" />
          <span className="text-muted-foreground">Password</span>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="text-sm px-3 py-2 btn rounded-lg background-gradient text-white hover:bg-foreground/90 transition duration-300"
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
          className="text-sm px-3 py-2 btn rounded-lg text-white bg-gradient-to-b from-red-500 to-red-800 transition duration-300"
        >
          Delete Account
        </button>
      </div>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-primary/20 glass glass-strong rounded-2xl p-6 w-full max-w-md space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              onClick={handleProfileUpdate}
              className="w-full flex items-center justify-center gap-2 py-3 btn rounded-xl background-gradient text-white font-semibold hover:bg-foreground/90 transition duration-300"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>Save</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-primary/20 glass glass-strong rounded-2xl p-6 w-full max-w-md space-y-4">
            {emailError && (
              <p className="w-full bg-red-500/80 rounded-xl p-4 text-white text-sm">
                {emailError}
              </p>
            )}

            {emailSuccess && (
              <p className="w-full bg-green-500/80 rounded-xl p-4 text-white text-sm">
                {emailSuccess}
              </p>
            )}

            <div className="flex justify-between">
              <h2 className="font-semibold">Change Email</h2>
              <X
                onClick={() => setShowEmailModal(false)}
                className="cursor-pointer"
              />
            </div>

            <label className="block text-sm font-medium text-foreground mb-1">
              New Email
            </label>
            <input
              type="email"
              placeholder="Enter new email"
              value={emailData.newEmail}
              onChange={(e) => {
                setEmailData({ ...emailData, newEmail: e.target.value });
                setEmailError("");
              }}
              className="w-full p-2 border rounded-lg"
            />

            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={emailData.password}
              onChange={(e) => {
                setEmailData({ ...emailData, password: e.target.value });
                setEmailError("");
              }}
              className="w-full p-2 border rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              onClick={handleEmailChange}
              className="w-full flex items-center justify-center gap-2 py-3 btn rounded-xl background-gradient text-white font-semibold hover:bg-foreground/90 transition duration-300"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>Change Your Email</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-primary/20 glass glass-strong rounded-2xl p-6 w-full max-w-md space-y-4">
            {passwordError && (
              <p className="w-full text-start bg-red-500/80 rounded-xl p-4 text-white text-sm text-center">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="w-full bg-green-500/80 rounded-xl p-4 text-white text-sm">
                {passwordSuccess}
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
              type="submit"
              disabled={loading}
              onClick={handlePasswordChange}
              className="w-full flex items-center justify-center gap-2 py-3 btn rounded-xl background-gradient text-white font-semibold hover:bg-foreground/90 transition duration-300"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>Update Your Password</>
              )}
            </button>
          </form>
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
                className="px-4 py-2 bg-white border border-border rounded-lg hover:scale-[1.02] transition duration-300 hover:shadow-lg"
              >
                No
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 btn rounded-lg text-white bg-gradient-to-b from-red-500 to-red-800 transition duration-300 hover:scale-[1.02] hover:shadow-lg"
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
