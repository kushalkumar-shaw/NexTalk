import { Zap } from "lucide-react";
import { Button } from "../ui/Button";

interface EmptyChatPlaceholderProps {
  onBrowse: () => void;
}

export function EmptyChatPlaceholder({ onBrowse }: EmptyChatPlaceholderProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-chat-bg">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Zap size={48} className="fill-current" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-text-main">Welcome to NexTalk</h2>
      <p className="mb-8 max-w-sm text-sidebar-muted">
        Select a room to start chatting or create a new one to connect with your team.
      </p>
      <Button onClick={onBrowse} size="lg">
        Browse Rooms
      </Button>
    </div>
  );
}
