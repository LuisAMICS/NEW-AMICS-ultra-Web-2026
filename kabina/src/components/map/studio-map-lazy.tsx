"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { StudioMap as StudioMapType } from "./studio-map";

const StudioMap = dynamic(() => import("./studio-map").then((m) => m.StudioMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-ink-100" />,
});

export function StudioMapLazy(props: ComponentProps<typeof StudioMapType>) {
  return <StudioMap {...props} />;
}
