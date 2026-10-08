"use client";

import { useState } from "react";
import { profile } from "@/data/content";

const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("")
  .slice(0, 2);

// Headshot beside the name; falls back to initials if the photo is missing.
export default function Avatar() {
  const [failed, setFailed] = useState(false);

  return (
    <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-client/60 bg-panel-2 shadow-[0_0_12px_-2px_var(--color-client)]">
      {failed ? (
        <span className="m-auto font-mono text-[11px] text-client" aria-hidden="true">
          {initials}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- tiny avatar; a broken file must fall back to initials
        <img
          src={profile.photo}
          alt=""
          width={32}
          height={32}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          // The load may already have failed before hydration attached onError.
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) setFailed(true);
          }}
        />
      )}
    </span>
  );
}
