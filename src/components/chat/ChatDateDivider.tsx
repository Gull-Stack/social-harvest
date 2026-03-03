"use client";

import { format, isToday, isYesterday } from "date-fns";

interface ChatDateDividerProps {
  date: Date;
}

function formatDividerDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d, yyyy");
}

export function ChatDateDivider({ date }: ChatDateDividerProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium text-muted-foreground">
        {formatDividerDate(date)}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
