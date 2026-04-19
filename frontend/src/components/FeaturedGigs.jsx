import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllGigs } from "../api/gigs";
import GigCard from "./GigCard";

export default function FeaturedGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getAllGigs();
        setGigs(data.slice(0, 8)); // Show up to 8 gigs in the slider
      } catch (err) {
        setError("Failed to load featured gigs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth || 280;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Block */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Top Gigs This Week</h2>
            <p className="text-gray-400 mt-2">
              Discover the most popular services ordered by our community.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Prev / Next arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous gigs"
                style={{ cursor: canScrollLeft ? "pointer" : "default" }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200
                  ${canScrollLeft
                    ? "border-slate-600 text-white hover:bg-slate-700"
                    : "border-slate-800 text-slate-700"}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next gigs"
                style={{ cursor: canScrollRight ? "pointer" : "default" }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200
                  ${canScrollRight
                    ? "border-slate-600 text-white hover:bg-slate-700"
                    : "border-slate-800 text-slate-700"}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* View all link */}
            <Link
              to="/gigs"
              className="border border-slate-700 px-4 py-2 rounded-full text-sm text-white hover:bg-slate-800 transition-colors"
            >
              View all →
            </Link>
          </div>
        </div>

        {/* State Rendering */}
        {loading ? (
          <div className="flex gap-6 overflow-x-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-700 flex-shrink-0 w-72 h-80 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-center mt-4">
            {error}
          </div>
        ) : gigs.length === 0 ? (
          <div className="py-16 text-center bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-gray-400">No featured gigs available at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex gap-6 overflow-x-auto pb-3 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {gigs.map((gig) => (
                <div key={gig.id} className="flex-shrink-0 w-72">
                  <GigCard gig={gig} />
                </div>
              ))}
            </div>

            {/* Fade edges */}
            {canScrollLeft && (
              <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-16 bg-gradient-to-r from-slate-900 to-transparent" />
            )}
            {canScrollRight && (
              <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-slate-900 to-transparent" />
            )}
          </div>
        )}

      </div>
    </section>
  );
}
