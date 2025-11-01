"use client";

import { useEffect, useMemo, useState } from "react";
import { Advocate } from "./types";
import { AdvocatesTable } from "./components/AdvocatesTable";

type ApiResponse = {
  data: Advocate[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function Home() {
  const [rows, setRows] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Build the search URL
  const apiUrl = useMemo(() => {
    const sp = new URLSearchParams();
    if (currentSearchTerm.trim()) sp.set("search", currentSearchTerm.trim());
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));
    return `/api/advocates?${sp.toString()}`;
  }, [currentSearchTerm, page, pageSize]);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(apiUrl, { cache: "no-store" });
        const json: ApiResponse = await res.json();

        if (cancelled) return; // skip state updates if this is an out of date request

        setRows(json.data ?? []);
        setTotal(json.total ?? 0);
        setTotalPages(json.totalPages ?? 1);
        if (page > (json.totalPages ?? 1)) setPage(json.totalPages ?? 1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); // wait 300 ms so table isn't bouncing on type

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [apiUrl, page]);

  // Handlers
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(e.target.value);
    setPage(1); // reset to page 1 when search changes
  };

  const onReset = () => {
    setCurrentSearchTerm("");
    setPage(1);
  };

  return (
    <main className="m-6 font-sans">
      <h1 className="text-2xl font-semibold mb-4">Solace Advocates</h1>

      {/* Search input */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm w-80"
          value={currentSearchTerm}
          onChange={onChangeSearch}
          placeholder="Search name, city, degree..."
        />
        <button
          onClick={onReset}
          className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
        >
          Reset Search and Pagination
        </button>
      </div>

      {/* Advocates Table */}
      <AdvocatesTable
        rows={rows}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onFirst={() => setPage(1)}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onLast={() => setPage(totalPages)}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />
    </main>
  );
}
