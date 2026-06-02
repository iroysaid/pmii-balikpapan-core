"use client";

import { Download, FileText, Share2 } from "lucide-react";

type MemberCardActionsProps = {
  name: string;
  noInduk: string;
  komisariat: string;
  status: string;
  verificationUrl: string;
};

export default function MemberCardActions({
  name,
  noInduk,
  komisariat,
  status,
  verificationUrl,
}: MemberCardActionsProps) {
  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 680;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 1080, 680);
    gradient.addColorStop(0, "#262EED");
    gradient.addColorStop(0.72, "#122562");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 680);

    ctx.fillStyle = "rgba(245, 202, 15, 0.22)";
    ctx.beginPath();
    ctx.arc(930, 95, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.roundRect(54, 54, 972, 572, 48);
    ctx.fill();

    ctx.fillStyle = "#F5CA0F";
    ctx.font = "700 30px Arial";
    ctx.fillText("KARTU ANGGOTA DIGITAL", 96, 132);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 58px Arial";
    ctx.fillText(name || "Sahabat PMII", 96, 270);

    ctx.font = "700 32px Arial";
    ctx.fillText(`NIA: ${noInduk || "Belum tersedia"}`, 96, 340);
    ctx.fillText(komisariat || "Komisariat belum diisi", 96, 392);

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.roundRect(96, 460, 460, 74, 37);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 28px Arial";
    ctx.fillText(status, 128, 506);

    ctx.fillStyle = "#FFFFFF";
    ctx.roundRect(790, 390, 160, 160, 28);
    ctx.fill();
    ctx.fillStyle = "#262EED";
    ctx.font = "900 30px Arial";
    ctx.fillText("QR", 850, 480);

    const link = document.createElement("a");
    link.download = `kartu-pmii-${name.toLowerCase().replace(/\s+/g, "-") || "kader"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareCard = async () => {
    const absoluteUrl = new URL(verificationUrl, window.location.origin).toString();
    if (navigator.share) {
      await navigator.share({
        title: "Kartu Anggota PMII Balikpapan",
        text: `Verifikasi kartu anggota ${name}`,
        url: absoluteUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(absoluteUrl);
    alert("Link verifikasi kartu disalin.");
  };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={downloadPng}
        className="inline-flex min-h-14 flex-col items-center justify-center rounded-2xl bg-primary px-3 py-3 text-xs font-black text-white transition active:scale-95"
      >
        <Download className="mb-1 h-4 w-4" />
        PNG
      </button>
      <button
        type="button"
        onClick={printCard}
        className="inline-flex min-h-14 flex-col items-center justify-center rounded-2xl bg-white px-3 py-3 text-xs font-black text-primary shadow-sm transition active:scale-95"
      >
        <FileText className="mb-1 h-4 w-4" />
        PDF
      </button>
      <button
        type="button"
        onClick={shareCard}
        className="inline-flex min-h-14 flex-col items-center justify-center rounded-2xl bg-[#F5CA0F] px-3 py-3 text-xs font-black text-secondary transition active:scale-95"
      >
        <Share2 className="mb-1 h-4 w-4" />
        Share
      </button>
    </div>
  );
}
