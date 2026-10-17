// components/UnitToggle.jsx
"use client";

import { useState } from "react";

const units = ["F", "C"];

export default function UnitToggle({ unit, setUnit }) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/10 bg-[#12162d] p-1 max-w-[120]">
      {units.map((u) => (
        <button
          key={u}
          onClick={() => setUnit(u)}
          className={`h-9 w-12 rounded-lg text-sm font-semibold transition ${
            unit === u
              ? "bg-[#0e324c] text-cyan-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}
