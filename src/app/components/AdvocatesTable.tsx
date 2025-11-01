"use client";

import React from "react";
import type { Advocate } from "../types";

export type AdvocatesTableProps = {
  rows: Advocate[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onPageSizeChange: (n: number) => void;
};

export const AdvocatesTable = React.memo(function AdvocatesDataTable({
  rows,
  loading,
  page,
  totalPages,
  total,
  pageSize,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onPageSizeChange,
}: AdvocatesTableProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <>
      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full table-fixed border-separate border-spacing-0 text-sm">
          <colgroup>
            <col className="w-[120px]" /> {/* First Name */}
            <col className="w-[130px]" /> {/* Last Name */}
            <col className="w-[140px]" /> {/* City */}
            <col className="w-[120px]" /> {/* Degree */}
            <col className="w-[420px]" /> {/* Specialties */}
            <col className="w-[170px]" /> {/* Years */}
            <col className="w-[160px]" /> {/* Phone */}
          </colgroup>

          <thead className="bg-gray-100 text-left">
            <tr>
              {[
                "First Name",
                "Last Name",
                "City",
                "Degree",
                "Specialties",
                "Years of Experience",
                "Phone Number",
              ].map((h) => {
                const center = h === "Years of Experience";
                return (
                  <th
                    key={h}
                    scope="col"
                    className={`px-3 py-2 font-semibold border-b-2 border-gray-200 ${
                      center ? "text-center" : ""
                    }`}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr
                  key={`s-${i}`}
                  className={i % 2 ? "bg-gray-50" : "bg-white"}
                >
                  <td
                    className="px-3 py-3 border-b border-gray-200"
                    colSpan={7}
                  >
                    <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-gray-600" colSpan={7}>
                  No advocates match your filters.
                </td>
              </tr>
            ) : (
              rows.map((a, i) => (
                <tr
                  key={`${a.firstName}|${a.lastName}|${a.phoneNumber}|${i}`}
                  className={i % 2 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-3 py-2 border-b border-gray-200">
                    {a.firstName}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-200">
                    {a.lastName}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-200">
                    {a.city}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-200">
                    {a.degree}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-200 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {a.specialties.map((s) => (
                        <span
                          key={s}
                          className="inline-block rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 max-w-[260px] truncate"
                          title={s}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 border-b border-gray-200 text-center">
                    {a.yearsOfExperience}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-200 whitespace-nowrap">
                    <a
                      href={`tel:${a.phoneNumber}`}
                      className="text-blue-600 hover:underline"
                    >
                      {formatPhone(a.phoneNumber)}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="text-gray-600">
          {total === 0 ? "0 results" : `${start}–${end} of ${total}`}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows per page</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <button
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
            onClick={onFirst}
            disabled={!canPrev}
            aria-label="First page"
          >
            «
          </button>
          <button
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="px-2">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next page"
          >
            Next
          </button>
          <button
            className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
            onClick={onLast}
            disabled={!canNext}
            aria-label="Last page"
          >
            »
          </button>
        </div>
      </div>
    </>
  );
});

function formatPhone(num: string | number): string {
  const digits = String(num).replace(/\D/g, "");
  if (digits.length === 10)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1"))
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
      7
    )}`;
  return String(num);
}
