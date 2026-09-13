"use client";

import { Button } from "@/components/ui/button";

export function CancelButton({ label, confirmText }: { label: string; confirmText: string }) {
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full text-rec hover:bg-red-50"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {label}
    </Button>
  );
}
