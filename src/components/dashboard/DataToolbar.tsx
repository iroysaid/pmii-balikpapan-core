"use client";

import { Search, Filter, ArrowUpDown, Download, X, Check } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
// @ts-ignore
import { mkConfig, generateCsv, download } from 'export-to-csv';

interface DataToolbarProps {
    searchPlaceholder?: string;
    dataForExport?: any[];
    exportFilename?: string;
    isSuperAdmin?: boolean;
}

export default function DataToolbar({
    searchPlaceholder = "Cari data...",
    dataForExport = [],
    exportFilename = "data_export",
    isSuperAdmin = false,
}: DataToolbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Filter state
    const currentRoles = searchParams.get("role")?.split(",").filter(Boolean) || [];
    const currentKomisariats = searchParams.get("komisariat")?.split(",").filter(Boolean) || [];
    const isGrouped = searchParams.get("groupBy") === "komisariat";

    const filterCount = currentRoles.length + currentKomisariats.length;

    const komisariatOptions = ["Nusantara", "Uniba", "Mulia", "Staiba", "Stitba"];
    const roleOptions = ["KADER", "PENGURUS_KOMISARIAT", "PENGURUS_CABANG", "ADMIN_CABANG", "SUPER_ADMIN"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    const toggleFilter = (type: "role" | "komisariat", value: string) => {
        const current = type === "role" ? currentRoles : currentKomisariats;
        let next;
        if (current.includes(value)) {
            next = current.filter(v => v !== value);
        } else {
            next = [...current, value];
        }
        updateParams({ [type]: next.length > 0 ? next.join(",") : null });
    };

    const resetFilters = () => {
        updateParams({ role: null, komisariat: null });
        setShowFilters(false);
    };

    const handleExport = async (type: "csv" | "pdf") => {
        if (!dataForExport || dataForExport.length === 0) return;

        if (type === "csv") {
            const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: exportFilename });
            const csv = generateCsv(csvConfig)(dataForExport);
            download(csvConfig)(csv);
        } else {
            const jsPDF = (await import("jspdf")).default;
            const autoTable = (await import("jspdf-autotable")).default;
            const doc = new jsPDF();
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
                headStyles: { fillColor: [41, 128, 185] },
            });
            doc.save(`${exportFilename}.pdf`);
        }
    };

    if (!isSuperAdmin) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={searchParams.get("q")?.toString()}
                        onChange={(e) => updateParams({ q: e.target.value || null })}
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    {/* Grouping Toggle */}
                    <div className="flex items-center space-x-2 mr-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={isGrouped}
                                onChange={(e) => updateParams({ groupBy: e.target.checked ? "komisariat" : null })}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ml-2 text-xs font-medium text-gray-700">Grup Komisariat</span>
                        </label>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 border rounded-lg text-sm font-medium flex items-center transition ${filterCount > 0 ? "bg-primary text-white border-primary" : "bg-white text-secondary hover:bg-gray-50"}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filter {filterCount > 0 && `(${filterCount})`}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm text-primary">Filter Data</h3>
                                    <button onClick={resetFilters} className="text-[10px] text-red-500 hover:underline font-bold">Reset</button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Komisariat</h4>
                                        <div className="space-y-1">
                                            {komisariatOptions.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => toggleFilter("komisariat", opt)}
                                                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50 text-xs text-secondary"
                                                >
                                                    <span>{opt}</span>
                                                    {currentKomisariats.includes(opt) && <Check className="w-3 h-3 text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Role User</h4>
                                        <div className="space-y-1">
                                            {roleOptions.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => toggleFilter("role", opt)}
                                                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50 text-xs text-secondary"
                                                >
                                                    <span className="truncate">{opt.replace(/_/g, ' ')}</span>
                                                    {currentRoles.includes(opt) && <Check className="w-3 h-3 text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border px-4 py-2 pr-8 rounded-lg text-sm font-medium text-secondary focus:outline-none focus:ring-2 focus:ring-primary h-full"
                            onChange={(e) => updateParams({ sort: e.target.value || null })}
                            defaultValue={searchParams.get("sort")?.toString()}
                        >
                            <option value="">Urutkan...</option>
                            <option value="name-asc">Nama (A-Z)</option>
                            <option value="name-desc">Nama (Z-A)</option>
                            <option value="mapaba-desc">Angkatan (Terbaru)</option>
                            <option value="mapaba-asc">Angkatan (Terlama)</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Export */}
                    <div className="relative group">
                        <button className="px-3 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center hover:bg-green-100 transition">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <button onClick={() => handleExport("csv")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-secondary hover:text-primary first:rounded-t-xl">
                                Export CSV
                            </button>
                            <button onClick={() => handleExport("pdf")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-secondary hover:text-primary last:rounded-b-xl">
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
