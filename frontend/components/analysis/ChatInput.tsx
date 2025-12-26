import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-card p-2 transition-all duration-200",
          isFocused && "border-primary ring-2 ring-primary/20"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Sparkles className="h-4 w-4 text-accent-foreground" />
        </div>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask the AI about this document..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        
        <Button
          type="submit"
          size="sm"
          disabled={!message.trim()}
          className="h-8 px-3 gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        The contextual chat analyzes the uploaded document to answer your questions
      </p>
    </form>
  );
}