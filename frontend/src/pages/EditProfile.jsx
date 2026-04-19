import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/users";

export default function EditProfile() {
  const { token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: "", bio: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Pre-populate with current data
  useEffect(() => {
    getProfile(token)
      .then(({ user }) => {
        setForm({
          username: user.username || "",
          bio:      user.bio      || "",
          image:    user.image    || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const { user: updated } = await updateProfile(form, token);
      // Sync navbar avatar/username immediately
      updateUser(updated);
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-16 px-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Edit Profile</h1>
          <p className="text-gray-400">Update your public profile information.</p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-800 rounded-xl" />
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col gap-6 shadow-xl"
          >
            {/* Avatar Preview */}
            <div className="flex items-center gap-5">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-600"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-xl font-bold text-white">
                  {form.username?.slice(0, 2).toUpperCase() || "??"}
                </div>
              )}
              <p className="text-gray-400 text-sm">
                Paste an image URL below to update your avatar.
              </p>
            </div>

            {/* Fields */}
            {[
              { name: "username", label: "Username",    type: "text",  placeholder: "Your display name" },
              { name: "image",    label: "Avatar URL",  type: "url",   placeholder: "https://..." },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-gray-300 text-sm font-semibold">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors text-sm"
                />
              </div>
            ))}

            {/* Bio textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm font-semibold">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell buyers a bit about yourself..."
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors text-sm resize-none"
              />
            </div>

            {/* Feedback */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm">
                ✓ {success}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
