import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { uiStrings } from "@/lib/uiStrings";
/** Local text updates immediately; filtering waits until typing settles. */
export function SearchInput({ onSearch, delay = 300, className }: { onSearch: (query: string) => void; delay?: number; className?: string }) {
 const [text, setText] = useState("");
 const value = useDebounce(text, delay);
 const callback = useRef(onSearch);
 useEffect(() => { callback.current = onSearch; }, [onSearch]);
 useEffect(() => { callback.current(value); }, [value]);
 return <Input className={className} label={uiStrings.search} value={text} onValueChange={setText} isClearable onClear={() => setText("")} startContent={<Search size={18} aria-hidden="true" />} />;
}
