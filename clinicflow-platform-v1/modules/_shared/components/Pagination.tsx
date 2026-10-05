import React from "react";
import { Group, Text, Select, Pagination as MantinePagination } from "@mantine/core";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalDocs?: number;
  limit?: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  itemLabel?: string;
}

export function Pagination({
  page,
  totalPages,
  totalDocs = 0,
  limit = 10,
  isLoading = false,
  onPageChange,
  onLimitChange,
  itemLabel = "résultats",
}: PaginationProps) {
  if (totalDocs === 0) return null;

  const startIdx = totalDocs === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, totalDocs);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-4">
      {/* Items count summary */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>
          Affichage de <strong className="text-slate-800 font-semibold">{startIdx}</strong> à{" "}
          <strong className="text-slate-800 font-semibold">{endIdx}</strong> sur{" "}
          <strong className="text-slate-800 font-semibold">{totalDocs}</strong> {itemLabel}
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-3">
            <span className="text-slate-400">Lignes :</span>
            <Select
              size="xs"
              className="w-20"
              value={String(limit)}
              onChange={(val) => val && onLimitChange(Number(val))}
              data={[
                { value: "5", label: "5" },
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
              ]}
              allowDeselect={false}
            />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <Group gap="xs" align="center">
        <MantinePagination
          value={page}
          onChange={onPageChange}
          total={Math.max(1, totalPages)}
          color="teal"
          size="sm"
          radius="md"
          withEdges
          disabled={isLoading}
        />
      </Group>
    </div>
  );
}

export default Pagination;
