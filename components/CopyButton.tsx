"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="copy"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1400);
        });
      }}
    >
      {ok ? "copied ✓" : "copy"}
    </button>
  );
}
