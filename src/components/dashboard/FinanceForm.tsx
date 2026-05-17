"use client";

import { createTransaction, updateTransaction } from "@/app/actions/keuangan";
import SubmitButton from "@/components/dashboard/SubmitButton";
import type { Transaction } from "@prisma/client";
import { Wallet, TrendingUp, TrendingDown, Save } from "lucide-react";
import { useState } from "react";

interface FinanceFormProps {
    initialData?: Transaction;
    isEdit?: boolean;
}

export default function FinanceForm({ initialData, isEdit = false }: FinanceFormProps) {
    const [type, setType] = useState(initialData?.type || "DEBIT");

    const action = isEdit ? updateTransaction.bind(null, initialData!.id) : createTransaction;

    return (
        <form action={action} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 h-fit">
            <div>
                <label className="block text-sm font-bold text-primary mb-2">Jenis Transaksi</label>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setType("DEBIT")}
                        className={`flex-1 py-3 rounded-lg border flex items-center justify-center font-bold transition ${type === "DEBIT" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                    >
                        <TrendingUp className="w-4 h-4 mr-2" /> Pemasukan
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("CREDIT")}
                        className={`flex-1 py-3 rounded-lg border flex items-center justify-center font-bold transition ${type === "CREDIT" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                    >
                        <TrendingDown className="w-4 h-4 mr-2" /> Pengeluaran
                    </button>
                </div>
                <input type="hidden" name="type" value={type} />
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2">Tanggal</label>
                <input
                    type="date"
                    name="date"
                    required
                    defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2">Nominal (Rp)</label>
                <input
                    type="number"
                    name="amount"
                    required
                    defaultValue={initialData?.amount}
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono text-lg"
                    placeholder="0"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2">Keterangan / Deskripsi</label>
                <textarea
                    name="description"
                    required
                    defaultValue={initialData?.description}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Contoh: Iuran anggota bulan ini..."
                ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
                <SubmitButton pendingLabel={isEdit ? "Mengupdate..." : "Menyimpan..."} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition flex items-center w-full justify-center lg:w-auto">
                    {isEdit ? <Save className="w-4 h-4 mr-2" /> : <Wallet className="w-4 h-4 mr-2" />}
                    {isEdit ? "Update Transaksi" : "Simpan Transaksi"}
                </SubmitButton>
            </div>
        </form>
    );
}
