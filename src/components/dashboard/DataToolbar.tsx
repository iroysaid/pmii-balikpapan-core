"use client";

import { Search, Filter, ArrowUpDown, Download } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
// @ts-ignore
import { mkConfig, generateCsv, download } from 'export-to-csv';

interface FilterOption {
    label: string;
    value: string;
}

interface SortOption {
    label: string;
    value: string; // "key-asc" or "key-desc"
}

interface DataToolbarProps {
    searchPlaceholder?: string;
    filterOptions?: { key: string; label: string; options: FilterOption[] }[];
    sortOptions?: SortOption[];
    onSearch?: (query: string) => void;
    dataForExport?: any[];
    exportFilename?: string;
    isSuperAdmin?: boolean; // Control visibility
}

export default function DataToolbar({
    searchPlaceholder = "Cari data...",
    filterOptions = [],
    sortOptions = [],
    dataForExport = [],
    exportFilename = "data_export",
    isSuperAdmin = false,
}: DataToolbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [showFilters, setShowFilters] = useState(false);

    // If not super admin, return null or restricted view? 
    // Requirement: "Akses super admin... berikan fitur... akses lain hanya view only"
    // So if strictly implementing controls, hide them if not super admin.
    if (!isSuperAdmin) return null;

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    const handleExport = async (type: "csv" | "pdf") => {
        if (!dataForExport || dataForExport.length === 0) return;

        if (type === "csv") {
            const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: exportFilename });
            const csv = generateCsv(csvConfig)(dataForExport);
            download(csvConfig)(csv);
        } else {
            // Dynamic import to avoid SSR issues
            const jsPDF = (await import("jspdf")).default;
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF();

            // Extract headers and data
            const headers = Object.keys(dataForExport[0]);
            const body = dataForExport.map(row => Object.values(row)) as any[];

            doc.text(`${exportFilename.replace(/-/g, ' ')}`, 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString("id-ID")}`, 14, 20);

            autoTable(doc, {
                head: [headers],
                body: body,
                startY: 25,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }, // Primary Blue
            });

            doc.save(`${exportFilename}.pdf`);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={searchParams.get("q")?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Toggle Filters */}
                    {filterOptions.length > 0 && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center transition ${showFilters ? "bg-primary text-white border-primary" : "bg-white text-secondary hover:bg-gray-50"}`}
                        >
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </button>
                    )}

                    {/* Sort Dropdown */}
                    {sortOptions.length > 0 && (
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border px-4 py-2 pr-8 rounded-lg text-sm font-medium text-secondary focus:outline-none focus:ring-2 focus:ring-primary h-full"
                                onChange={(e) => handleSort(e.target.value)}
                                defaultValue={searchParams.get("sort")?.toString()}
                            >
                                <option value="">Urutkan...</option>
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    )}

                    {/* Export Dropdown */}
                    <div className="relative group">
                        <button
                            className="px-3 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-100 transition"
                        >
                            <Download className="w-4 h-4 mr-2" /> Export
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <button
                                onClick={() => handleExport("csv")}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-secondary hover:text-primary first:rounded-t-xl"
                            >
                                Export CSV (Data Mentah)
                            </button>
                            <button
                                onClick={() => handleExport("pdf")}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-secondary hover:text-primary last:rounded-b-xl"
                            >
                                Export PDF (Data Matang)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                    {filterOptions.map((filter) => (
                        <div key={filter.key}>
                            <label className="block text-xs font-bold text-gray-500 mb-1">{filter.label}</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                onChange={(e) => handleFilter(filter.key, e.target.value)}
                                defaultValue={searchParams.get(filter.key)?.toString()}
                            >
                                <option value="">Semua</option>
                                {filter.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
