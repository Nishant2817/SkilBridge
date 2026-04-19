import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const categories = [
  {
    id: 1,
    title: "Design",
    description: "Logos, branding, UI/UX",
    count: "2.4k services",
    accent: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Development",
    description: "Web, mobile, software",
    count: "3.1k services",
    accent: "#3b82f6",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Writing",
    description: "Copywriting, blogs, editing",
    count: "1.8k services",
    accent: "#eab308",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Video",
    description: "Editing, motion, 3D",
    count: "1.2k services",
    accent: "#ec4899",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Marketing",
    description: "SEO, ads, social media",
    count: "2.0k services",
    accent: "#f97316",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Music",
    description: "Mixing, composing, voiceover",
    count: "980 services",
    accent: "#06b6d4",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    title: "Business",
    description: "Strategy, consulting, finance",
    count: "1.5k services",
    accent: "#10b981",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    title: "Data & AI",
    description: "Analysis, ML, automation",
    count: "870 services",
    accent: "#6366f1",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&auto=format&fit=crop&q=80",
  },
];

export default function CategoriesSection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleCategoryClick = (title) => {
    navigate(`/gigs?category=${encodeURIComponent(title)}`);
  };

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 288 + 24; // w-72 + gap-6
    el.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Explore Our Top Categories</h2>
            <p className="text-gray-400 mt-2">
              From creative design to expert development — find the right talent for your project.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200
                  ${canScrollLeft
                    ? "border-slate-600 text-white hover:bg-slate-700"
                    : "border-slate-800 text-slate-700 cursor-default"}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200
                  ${canScrollRight
                    ? "border-slate-600 text-white hover:bg-slate-700"
                    : "border-slate-800 text-slate-700 cursor-default"}`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Strip */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-6 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.title)}
                className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-md hover:shadow-xl
                  transition-all duration-300 overflow-hidden hover:-translate-y-1
                  border border-gray-100 text-left group"
              >
                {/* ── Image Section ── */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop";
                    }}
                  />
                  {/* Count badge */}
                  <span
                    className="absolute top-3 left-3 text-white text-[11px] font-bold px-2.5 py-1 rounded"
                    style={{ backgroundColor: cat.accent }}
                  >
                    {cat.count}
                  </span>
                </div>

                {/* ── Details Section ── */}
                <div className="p-4 flex flex-col gap-1">
                  <h3
                    className="text-gray-800 font-bold text-base group-hover:transition-colors"
                    style={{ "--tw-text-opacity": 1 }}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{cat.description}</p>

                  <span
                    className="mt-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    style={{ color: cat.accent }}
                  >
                    Browse services →
                  </span>
                </div>
              </button>
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

      </div>
    </section>
  );
}
