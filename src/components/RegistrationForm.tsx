"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function RegistrationForm({ activityId }: { activityId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      namaLengkap: formData.get("namaLengkap"),
      email: formData.get("email"),
      noWhatsapp: formData.get("noWhatsapp"),
      asalKomisariat: formData.get("asalKomisariat"),
      activityId: activityId,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Pendaftaran Berhasil! Silakan periksa email Anda (termasuk folder spam) untuk sertifikat/undangan.");
      } else {
        setStatus("error");
        setMessage(result.message || "Gagal mendaftar.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-full bg-accent text-primary font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg hover:-translate-y-1"
      >
        Daftar Sekarang
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-primary">Form Pendaftaran</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                >
                  ✕
                </button>
              </div>

              {status === "success" ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Pendaftaran Sukses!</h4>
                  <p className="text-gray-600">{message}</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-8 bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === "error" && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start">
                        <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                        <span>{message}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (Berta Gelar)</label>
                    <input 
                      type="text" 
                      name="namaLengkap" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="Contoh: Ahmad Fauzi, S.H."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Aktif</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="contoh@gmail.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pastikan email benar untuk menerima sertifikat/invitation Google Calendar.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp</label>
                    <input 
                      type="text" 
                      name="noWhatsapp" 
                      required 
                      pattern="62[0-9]{9,13}"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                      placeholder="628123456789"
                    />
                    <p className="text-xs text-red-500 mt-1">* Wajib diawali dengan kode negara 62 (Tanpa + atau awalan 0)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Asal Komisariat / Instansi</label>
                    <select 
                      name="asalKomisariat" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    >
                      <option value="">Pilih Instansi</option>
                      <option value="Komisariat UNIBA">Komisariat UNIBA</option>
                      <option value="Komisariat Nusantara">Komisariat Nusantara</option>
                      <option value="Komisariat Mulia">Komisariat Mulia</option>
                      <option value="Komisariat STITBA">Komisariat STITBA</option>
                      <option value="Komisariat STAIBA">Komisariat STAIBA</option>
                      <option value="Pengurus Cabang">Pengurus Cabang Balikpapan</option>
                      <option value="Umum / Eksternal">Umum / Eksternal</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition flex items-center justify-center disabled:opacity-70 mt-6"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {loading ? "Memproses..." : "Kirim Formulir Pendaftaran"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
