"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Link2, Smile, Send } from "lucide-react";

export function PostComposer() {
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=harvest" />
          <AvatarFallback>BM</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Share something with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            className="min-h-[44px] resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={focused ? 3 : 1}
          />
          {focused && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" disabled={!content.trim()}>
                <Send className="mr-2 h-3.5 w-3.5" />
                Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
