"use client";

export default function Sun_Moon({ weatherData }) {
  const daily = weatherData?.daily;
  const timezone = weatherData?.timezone;

  const sunrise = daily?.sunrise?.[0];
  const sunset = daily?.sunset?.[0];

  function formatTime(dateTime) {
    if (!dateTime) return "--:--";

    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    });
  }

  function getDayLength() {
    if (!sunrise || !sunset) return "--";

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);

    const diff = Math.round(
      (sunsetDate.getTime() - sunriseDate.getTime()) / 60000,
    );

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
  }

  // تحديد موقع الشمس بشكل تقريبي على المسار
  function getSunPosition() {
    if (!sunrise || !sunset) return { x: 100, y: 18 };

    const now = Date.now();
    const start = new Date(sunrise).getTime();
    const end = new Date(sunset).getTime();

    const progress = Math.max(0, Math.min(1, (now - start) / (end - start)));

    const x = 10 + progress * 180;
    const normalizedX = (x - 100) / 90;
    const y = 55 - 65 * (1 - normalizedX * normalizedX);

    return { x, y: Math.max(5, y) };
  }

  const sunPosition = getSunPosition();

  return (
    <section
      className="w-full rounded-3xl p-6 transition-all duration-300 hover:bg-white/5 sm:p-8"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Heading */}
      <p
        className="mb-6 text-xs font-semibold tracking-widest"
        style={{
          fontFamily: "monospace",
          color: "rgb(136, 153, 204)",
        }}
      >
        SUN &amp; MOON
      </p>

      {/* Sunrise and Sunset */}
      <div className="mb-4 flex justify-between gap-4">
        <div>
          <p
            className="mb-1.5 text-xs font-medium"
            style={{
              fontFamily: "monospace",
              color: "rgb(136, 153, 204)",
            }}
          >
            SUNRISE
          </p>

          <p
            className="text-xl font-bold sm:text-2xl"
            style={{
              fontFamily: "monospace",
              color: "rgb(251, 191, 36)",
              textShadow: "0 0 15px rgba(251, 191, 36, 0.3)",
            }}
          >
            {formatTime(sunrise)}
          </p>
        </div>

        <div className="text-right">
          <p
            className="mb-1.5 text-xs font-medium"
            style={{
              fontFamily: "monospace",
              color: "rgb(136, 153, 204)",
            }}
          >
            SUNSET
          </p>

          <p
            className="text-xl font-bold sm:text-2xl"
            style={{
              fontFamily: "monospace",
              color: "rgb(249, 115, 22)",
              textShadow: "0 0 15px rgba(249, 115, 22, 0.3)",
            }}
          >
            {formatTime(sunset)}
          </p>
        </div>
      </div>

      {/* Sun path */}
      <div className="relative h-20">
        <svg
          viewBox="0 0 200 60"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
          aria-label="Sunrise to sunset path"
          role="img"
        >
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            <filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Full path */}
          <path
            d="M 10 55 Q 100 -10 190 55"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Colored path */}
          <path
            d="M 10 55 Q 100 -10 190 55"
            fill="none"
            stroke="url(#sunGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="0"
          />

          {/* Sun */}
          {sunrise && sunset && (
            <circle
              cx={sunPosition.x}
              cy={sunPosition.y}
              r="6"
              fill="#fbbf24"
              filter="url(#sunGlow)"
            />
          )}

          {/* Sunrise and sunset endpoints */}
          <circle cx="10" cy="55" r="2.5" fill="#fbbf24" />
          <circle cx="190" cy="55" r="2.5" fill="#f97316" />
        </svg>
      </div>

      {/* Footer */}
      <div
        className="mt-2 flex flex-wrap justify-between gap-3 text-xs font-medium"
        style={{
          fontFamily: "monospace",
          color: "rgb(136, 153, 204)",
        }}
      >
        <span>Day length: {getDayLength()}</span>
        <span>🌙 Moon phase unavailable</span>
      </div>
    </section>
  );
}
