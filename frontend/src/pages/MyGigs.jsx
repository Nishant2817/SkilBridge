import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllGigs, deleteGig } from "../api/gigs";
import { useAuth } from "../context/AuthContext";
import GigCard from "../components/GigCard";

export default function MyGigs() {
  const { user, token } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyGigs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyGigs = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getAllGigs({ userId: user.id });
      setGigs(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gigId) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    
    try {
      await deleteGig(gigId, token);
      setGigs(gigs.filter((g) => g.id !== gigId));
    } catch (err) {
      alert(err.message || "Failed to delete gig");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 pt-28">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Gigs
            </h1>
            <p className="text-gray-500">
              Manage your active service offerings and create new ones.
            </p>
          </div>
          <Link
            to="/add-gig"
            className="mt-6 md:mt-0 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>+</span> Create New Gig
          </Link>
        </div>

        {/* Dynamic State Rendering */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col h-[340px] bg-white rounded-2xl overflow-hidden shadow-md animate-pulse border border-gray-100">
                <div className="h-48 bg-gray-200 w-full" />
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
            <span className="text-3xl block mb-2">⚠️</span>
            <h3 className="text-red-500 font-semibold">{error}</h3>
            <button onClick={fetchMyGigs} className="mt-4 px-4 py-2 bg-white text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
              Try Again
            </button>
          </div>
        ) : gigs.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="text-5xl mb-4 opacity-50">💼</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Gigs Yet</h3>
            <p className="text-gray-500 max-w-md mb-8">
              You haven't created any gigs yet. Start offering your services to buyers across the platform!
            </p>
            <Link
              to="/add-gig"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-full transition-all shadow-lg hover:shadow-emerald-500/40 w-full sm:w-auto hover:-translate-y-1"
              style={{ color: "#ffffff" }}
            >
              Create Your First Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map(gig => (
              <GigCard key={gig.id} gig={gig} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
