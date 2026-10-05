import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";
import { CardBody } from "./CardBody";
export interface Column<T> { key: string; label: string; render: (row: T) => ReactNode }
/** A semantic desktop table becomes labeled cards below md. */
export function Table<T>({ rows, columns, rowKey, label, empty, className }: { rows: T[]; columns: Column<T>[]; rowKey: (row: T) => string; label: string; empty: ReactNode; className?: string }) {
 if (!rows.length) return <div className={className}>{empty}</div>;
 return <div className={cn("min-w-0", className)}>
 <div className="hidden md:block overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{label}</caption><thead><tr>{columns.map(c => <th key={c.key} scope="col" className="p-4 text-muted font-medium border-b border-border">{c.label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={rowKey(row)}>{columns.map(c => <td key={c.key} className="p-4 border-b border-border">{c.render(row)}</td>)}</tr>)}</tbody></table></div>
 <ul aria-label={label} className="md:hidden space-y-3">{rows.map(row => <li key={rowKey(row)}><Card><CardBody><dl className="space-y-3">{columns.map(c => <div key={c.key} className="flex justify-between gap-4"><dt className="text-muted">{c.label}</dt><dd>{c.render(row)}</dd></div>)}</dl></CardBody></Card></li>)}</ul>
 </div>;
}
