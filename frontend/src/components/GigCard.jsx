import { Link } from "react-router-dom";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop";

const CATEGORY_COLORS = {
  Design:      "bg-violet-500",
  Development: "bg-blue-500",
  Marketing:   "bg-orange-500",
  Writing:     "bg-yellow-500",
  Video:       "bg-pink-500",
  Music:       "bg-cyan-500",
  Business:    "bg-emerald-500",
  Data:        "bg-indigo-500",
};

export default function GigCard({ gig }) {
  const price        = Number(gig.price) || 0;
  const oldPrice     = Math.round(price * 1.2);           // synthetic "before" price (+20%)
  const discountPct  = 17;                                // always show a discount badge
  const hasImage     = Boolean(gig.image);
  const catColor     = CATEGORY_COLORS[gig.category] || "bg-slate-600";
  const initials     = gig.user?.username?.slice(0, 2).toUpperCase() || "?";

  return (
    <Link to={`/gigs/${gig.id}`} className="block group">
      <div className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 h-full border border-gray-100">

        {/* ── Image Section ───────────────────────────────────── */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={hasImage ? gig.image : FALLBACK_IMAGE}
            alt={gig.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />

          {/* Discount badge */}
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
            Save {discountPct}%
          </span>

          {/* Category badge */}
          {gig.category && (
            <span className={`absolute top-3 right-3 ${catColor} text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full`}>
              {gig.category}
            </span>
          )}
        </div>

        {/* ── Card Body ───────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-3">

          {/* Seller row */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <span className="text-gray-500 text-xs font-medium truncate">
              {gig.user?.username || "Unknown Seller"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-gray-800 font-semibold text-base leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {gig.title}
          </h3>

          {/* Star rating (cosmetic) */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < 4 ? "text-amber-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="text-xs text-gray-400 ml-1">(4.0)</span>
          </div>

          {/* Price row */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-emerald-600 text-lg font-bold">
                ${price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs line-through">
                ${oldPrice.toLocaleString()}
              </span>
            </div>

            {/* CTA Chip */}
            <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-3 py-1 rounded-full border border-emerald-200 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
              View
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}
