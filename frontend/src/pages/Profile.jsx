import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/users";

export default function Profile() {
  const { token, user: ctxUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getProfile(token)
      .then(({ user }) => setProfile(user))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const joinedYear = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  const initials = profile?.username?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 w-32 rounded-full bg-slate-800 mx-auto" />
            <div className="h-6 bg-slate-800 rounded w-48 mx-auto" />
            <div className="h-4 bg-slate-800 rounded w-64 mx-auto" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <>
            {/* Profile Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">

              {/* Banner */}
              <div className="h-28 bg-gradient-to-r from-emerald-600/30 via-slate-800 to-violet-600/20" />

              {/* Avatar + Info */}
              <div className="px-8 pb-8">
                <div className="flex items-end justify-between -mt-14 mb-6 flex-wrap gap-4">
                  <div className="relative">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.username}
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-xl"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                        {initials}
                      </div>
                    )}
                    {profile.isSeller && (
                      <span className="absolute -bottom-1 -right-1 bg-green-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-800">
                        SELLER
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile/edit"
                    className="px-5 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-semibold text-sm hover:bg-slate-600 transition-colors"
                  >
                    ✏️ Edit Profile
                  </Link>
                </div>

                <h1 className="text-2xl font-bold text-white mb-1">{profile.username}</h1>
                <p className="text-gray-400 text-sm mb-4">{profile.email}</p>

                {profile.bio ? (
                  <p className="text-gray-300 leading-relaxed text-sm mb-6 max-w-xl">{profile.bio}</p>
                ) : (
                  <p className="text-gray-600 italic text-sm mb-6">
                    No bio yet.{" "}
                    <Link to="/profile/edit" className="text-green-400 hover:underline">Add one →</Link>
                  </p>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Role",    value: profile.role === "admin" ? "Admin" : (profile.isSeller ? "Seller" : "Buyer") },
                    { label: "Member since", value: joinedYear },
                    { label: "Account", value: profile.isSeller ? "Seller" : "Buyer" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                      <p className="text-white font-semibold text-sm">{stat.value}</p>
                      <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: "My Orders",   icon: "📋", to: "/orders"   },
                { label: "My Sales",    icon: "📈", to: "/my-sales" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-green-500/40 hover:bg-slate-700/60 transition-all group"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-semibold group-hover:text-green-400 transition-colors">
                    {item.label}
                  </span>
                  <span className="ml-auto text-gray-600 group-hover:text-green-400">→</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
