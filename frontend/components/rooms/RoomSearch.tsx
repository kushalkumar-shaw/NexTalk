import { Input } from "../ui/Input";
import { Search } from "lucide-react";

interface RoomSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export function RoomSearch({ value, onChange }: RoomSearchProps) {
  return (
    <div className="px-2 mb-2">
      <Input 
        type="text"
        placeholder="Find a room..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<Search size={16} />}
        className="h-8 text-xs bg-sidebar-bg border-sidebar-border focus-visible:ring-1 focus-visible:ring-sidebar-text placeholder:text-sidebar-muted text-sidebar-text"
      />
    </div>
  );
}
