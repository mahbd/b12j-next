"use client";

import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  itemCount: number;
  limit: number;
  offset: number;
}

const Pagination = ({ itemCount, limit, offset }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (itemCount <= limit) return null;

  const changePage = (offset: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", offset.toString());
    params.set("limit", limit.toString());
    router.push("?" + params.toString());
  };

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm">
        Showing {offset + 1} - {offset + limit} of {itemCount}
      </p>
      <button
        className="btn btn-sm rounded-md py-0 px-2  disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={offset === 0}
        onClick={() => changePage(0)}
      >
        <BiChevronsLeft />
      </button>
      <button
        className="btn btn-sm rounded-md py-0 px-2  disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={offset === 0}
        onClick={() => changePage(Math.max(0, offset - limit))}
      >
        <BiChevronLeft />
      </button>
      <button
        className="btn btn-sm rounded-md py-0 px-2  disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={offset + limit >= itemCount}
        onClick={() => changePage(offset + limit)}
      >
        <BiChevronRight />
      </button>
      <button
        className="btn btn-sm rounded-md py-0 px-2  disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={offset + limit >= itemCount}
        onClick={() => changePage(itemCount - limit)}
      >
        <BiChevronsRight />
      </button>
      <select
        className="select select-sm border border-gray-300 hover:bg-gray-200 rounded-md"
        value={limit.toString()}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.set("limit", e.target.value);
          router.push("?" + params.toString());
        }}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
};

export default Pagination;
