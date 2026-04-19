import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const suggestions = ["Logo Design", "WordPress", "Voice Over", "Video Editing"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/gigs`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/gigs?search=${encodeURIComponent(suggestion)}`);
  };

  return (
    <section className="relative min-h-[600px] h-screen flex items-center justify-center overflow-hidden bg-slate-900">

      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop')" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 to-black/40" />

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-20">
        <div className="max-w-3xl">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
            Find the perfect <span className="text-green-500">freelance</span> services for your business
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 mt-2">
            Work with the best freelancers on the planet. Get your projects done faster, smarter, and at any budget.
          </p>

          {/* Search Bar Fix */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full overflow-hidden w-full max-w-xl mb-6 shadow-lg"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any service..."
              className="flex-1 px-4 py-3 outline-none text-black"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 font-semibold hover:bg-green-600 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Suggested Queries */}
          <div className="flex items-center flex-wrap gap-3">
            <span className="text-gray-400 text-sm font-semibold">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                type="button"
                className="px-4 py-1.5 rounded-full border border-slate-700/50 text-gray-300 hover:text-white text-sm transition-colors hover:border-green-500 hover:bg-slate-800"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
