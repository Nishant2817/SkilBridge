import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllGigs } from "../api/gigs";
import GigCard from "../components/GigCard";

const CATEGORIES = [
  "All",
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Music",
  "Business",
  "Data",
];

export default function Gigs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("category") || "All";
  const searchParam = searchParams.get("search") || "";

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Local state mirrored from URL parameters
  const [selectedCategory, setSelectedCategory] = useState(catParam);

  useEffect(() => {
    // Whenever URL params change, update local state
    const currentCat = searchParams.get("category") || "All";
    if (selectedCategory !== currentCat) {
      setSelectedCategory(currentCat);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (selectedCategory !== "All") filters.category = selectedCategory;
        if (searchParam) filters.search = searchParam;

        const data = await getAllGigs(filters);
        setGigs(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [selectedCategory, searchParam]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    
    // Build new params retaining search query if any
    const newParams = new URLSearchParams(searchParams);
    
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 pt-28">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Gigs
          </h1>
          <p className="text-gray-500 text-lg">
            {searchParam ? `Showing results for "${searchParam}"` : "Find the perfect freelance service for your business"}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`
                  snap-start px-5 py-2 rounded-full border font-semibold whitespace-nowrap transition-colors duration-200
                  ${isActive 
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md" 
                    : "border-gray-200 bg-white text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                  }
                `}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Dynamic State Rendering */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
               <div key={i} className="flex flex-col h-[340px] bg-white rounded-2xl overflow-hidden shadow-md animate-pulse border border-gray-100">
                 <div className="h-48 bg-gray-200 w-full" />
                 <div className="p-4 flex flex-col flex-1 gap-3">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                     <div className="h-3 w-24 bg-gray-200 rounded" />
                   </div>
                   <div className="w-full h-4 bg-gray-200 rounded" />
                   <div className="w-3/4 h-4 bg-gray-200 rounded" />
                   <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
                     <div className="h-4 w-16 bg-gray-200 rounded" />
                     <div className="h-4 w-12 bg-gray-200 rounded" />
                   </div>
                 </div>
               </div>
            ))}
          </div>
        ) : error ? (
           <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
             <span className="text-3xl block mb-2">⚠️</span>
             <h3 className="text-red-500 font-semibold">{error}</h3>
           </div>
        ) : gigs.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-5xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No gigs found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map(gig => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
