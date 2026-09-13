"use client";

import { Button } from "@/components/ui/button";

export function DeleteListingButton({ confirmText, children }: { confirmText: string; children: React.ReactNode }) {
  return (
    <Button type="submit" variant="ghost" size="sm" className="text-rec hover:bg-red-50" onClick={(e) => { if (!window.confirm(confirmText)) e.preventDefault(); }} aria-label="Delete">
      {children}
    </Button>
  );
}
