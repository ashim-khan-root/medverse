export function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 280"
      className={className}
      role="img"
      aria-label="A friendly clay-style heart with a medical cross and sparkles"
    >
      <defs>
        <linearGradient id="blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0ebff" />
          <stop offset="100%" stopColor="#e3f8ef" />
        </linearGradient>
        <linearGradient id="heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9d9d" />
          <stop offset="100%" stopColor="#ff7a7a" />
        </linearGradient>
        <linearGradient id="cross" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef7f2" />
        </linearGradient>
      </defs>

      <ellipse cx="170" cy="252" rx="116" ry="15" fill="#eadfd3" opacity="0.55" />
      <path
        d="M170 40c52 0 96 38 96 88s-38 84-96 118c-58-34-96-68-96-118s44-88 96-88z"
        fill="url(#blob)"
      />

      <g transform="translate(112 92)">
        <path
          d="M58 106C38 90 8 70 8 42 8 22 23 8 42 8c9 0 17 4 22 10 5-6 13-10 22-10 19 0 34 14 34 34 0 28-30 48-50 64z"
          fill="url(#heart)"
          stroke="#fff"
          strokeWidth="3"
        />
        <ellipse cx="38" cy="34" rx="12" ry="7" fill="#fff" opacity="0.55" transform="rotate(-25 38 34)" />
        <rect x="50" y="34" width="16" height="44" rx="5" fill="url(#cross)" />
        <rect x="36" y="48" width="44" height="16" rx="5" fill="url(#cross)" />
      </g>

      <g fill="#ffcf5c">
        <path d="M74 78l3.4 7.4L85 89l-7.6 3.6L74 100l-3.4-7.4L63 89l7.6-3.6z" />
        <path d="M268 128l2.6 5.6 5.8 2.7-5.8 2.7-2.6 5.6-2.6-5.6-5.8-2.7 5.8-2.7z" opacity="0.8" />
      </g>
      <g fill="#6fd3ac">
        <circle cx="258" cy="76" r="7" />
        <circle cx="86" cy="168" r="5" opacity="0.7" />
      </g>
      <g fill="#b9a6ef">
        <circle cx="276" cy="196" r="6" opacity="0.8" />
        <circle cx="58" cy="120" r="4" />
      </g>
    </svg>
  );
}

export function BodyArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden>
      <ellipse cx="60" cy="212" rx="34" ry="6" fill="#eadfd3" opacity="0.6" />
      <circle cx="60" cy="28" r="22" fill="#f6ead9" stroke="#ead9c6" strokeWidth="2" />
      <path
        d="M60 48c18 0 30 10 33 26l5 44c1 8-9 12-13 5l-6-20v80c0 6-8 6-8 0v-46h-4v46c0 6-8 6-8 0v-80l-6 20c-4 7-14 3-13-5l5-44c3-16 15-26 33-26z"
        fill="#f6ead9"
        stroke="#ead9c6"
        strokeWidth="2"
      />
    </svg>
  );
}
