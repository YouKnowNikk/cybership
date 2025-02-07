"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Order {
  id: number;
  customerName: string;
  customerAddress: string;
  fulfillmentStatus: string;
  createdAt: string;
}

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageIndex, setPageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/trpc/order.getOrders", {
          params: {
            input: JSON.stringify({ page: pageIndex + 1, limit: 10 }),
          },
        });

        if (response.data) {
          setOrders(response.data.result.data);
          setTotalPages(Math.ceil(response.data.result.data.length / 10));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pageIndex]);

  const columnHelper = createColumnHelper<Order>();

  const columns: ColumnDef<Order>[] = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("customerName", { header: "Customer Name" }),
    columnHelper.accessor("customerAddress", { header: "Address" }),
    columnHelper.accessor("fulfillmentStatus", { header: "Status" }),
    columnHelper.accessor("createdAt", { header: "Date" }),
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: { pageIndex, pageSize: 10 },
    },
  });

  return (
    <Card className="shadow-lg border border-gray-400 rounded-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Orders</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="w-full border border-gray-500 rounded-lg shadow-sm">
                {/* Table Header */}
                <TableHeader className="bg-gray-200 border border-gray-500">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border border-gray-500">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="p-3 text-left font-semibold text-gray-800 border border-gray-500"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                {/* Table Body */}
                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className="border-2 border-black"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="p-3 text-gray-700 border-[2px] border-solid border-black
                          ">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border border-gray-500">
                      <TableCell colSpan={columns.length} className="text-center p-4 text-gray-500 border border-gray-500">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4 items-center">
              <Button
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md border border-gray-500"
                disabled={!table.getCanPreviousPage()}
                onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
              >
                Previous
              </Button>
              <span className="text-gray-700">
                Page {pageIndex + 1} of {totalPages}
              </span>
              <Button
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md border border-gray-500"
                disabled={!table.getCanNextPage()}
                onClick={() => setPageIndex((old) => Math.min(old + 1, totalPages - 1))}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
