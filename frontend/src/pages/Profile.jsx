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
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Page Title Header (matching My Gigs style) */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-500">
            View your personal details and quick links to your activity.
          </p>
        </div>

        {loading && (
          <div className="space-y-4 animate-pulse pt-4">
            <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded-xl text-center shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <>
            {/* Profile Card */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-50" />

              {/* Avatar + Info */}
              <div className="px-8 pb-8 relative">
                <div className="flex items-end justify-between -mt-16 mb-6 flex-wrap gap-4">
                  <div className="relative">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.username}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-4xl font-bold text-white">
                        {initials}
                      </div>
                    )}
                    {profile.isSeller && (
                      <span className="absolute bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                        SELLER
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile/edit"
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold text-sm hover:border-emerald-500 hover:text-emerald-600 shadow-sm transition-all hover:shadow-md"
                  >
                    ✏️ Edit Profile
                  </Link>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.username}</h1>
                <p className="text-gray-500 text-sm mb-6">{profile.email}</p>

                {profile.bio ? (
                  <p className="text-gray-700 leading-relaxed text-[15px] mb-8 max-w-2xl bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-400 italic text-sm mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block">
                    No bio yet.{" "}
                    <Link to="/profile/edit" className="text-emerald-500 hover:text-emerald-600 font-medium hover:underline">Add one →</Link>
                  </p>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                  {[
                    { label: "Role",    value: profile.role === "admin" ? "Admin" : (profile.isSeller ? "Seller" : "Buyer") },
                    { label: "Member since", value: joinedYear },
                    { label: "Account Status", value: profile.isActive !== false ? "Active" : "Suspended" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
                      <p className="text-gray-900 font-bold text-lg mb-1">{stat.value}</p>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "My Orders",   icon: "📋", to: "/orders", desc: "Track and manage your purchases" },
                  { label: "My Sales",    icon: "📈", to: "/my-sales", desc: "View your gig earnings and fulfillment" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-100 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold group-hover:text-emerald-600 transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <span className="ml-auto text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
