import { useEffect, useState } from "react";
/** Debounce an input value before filtering or fetching. */
export function useDebounce<T>(value: T, delay = 300) {
 const [debounced, setDebounced] = useState(value);
 useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]);
 return debounced;
}
