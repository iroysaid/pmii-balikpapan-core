import { Milestone, Target, Users } from "lucide-react";

export default function ProfilPage() {
    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Profil Organisasi</h1>
                <p className="text-blue-100 text-lg">Mengenal lebih dekat PMII Cabang Balikpapan</p>
            </div>

            <div className="container mx-auto px-4 mt-[-3rem] relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card Sejarah */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent">
                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-6">
                            <Milestone className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Sejarah Singkat</h3>
                        <p className="text-secondary text-sm leading-relaxed mb-4">
                            Pergerakan Mahasiswa Islam Indonesia (PMII) lahir dari kegelisahan mahasiswa Nahdliyin akan peran mahasiswa dalam membangun bangsa.
                        </p>
                        <p className="text-secondary text-sm leading-relaxed">
                            Cabang Balikpapan telah berdiri sejak tahun [Tahun] dan terus berkontribusi dalam mencetak kader-kader ulul albab.
                        </p>
                    </div>

                    {/* Card Visi Misi */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary">
                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Visi & Misi</h3>
                        <ul className="text-secondary text-sm space-y-2 list-disc list-inside">
                            <li>Terbentuknya pribadi muslim Indonesia yang bertaqwa kepada Allah SWT.</li>
                            <li>Berbudi luhur, berilmu, cakap, dan bertanggung jawab.</li>
                            <li>Mengamalkan nilai-nilai Ahlussunnah wal Jamaah.</li>
                        </ul>
                    </div>

                    {/* Card Nilai Dasar */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent">
                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-6">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-3">Nilai Dasar Pergerakan</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            Tauhid, Habluminallah, Habluminannas, dan Habluminalalam. Menjadi landasan berpikir dan bertindak setiap kader PMII.
                        </p>
                    </div>
                </div>

                {/* Struktur Organisasi Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-primary text-center mb-12">Struktur Pengurus Cabang</h2>
                    <div className="flex justify-center">
                        {/* Placeholder for Structure Image/Diagram */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-4xl w-full text-center py-20 text-gray-400">
                            [Diagram Struktur Organisasi akan ditampilkan di sini]
                            <br />
                            <span className="text-sm">Ketua Cabang - Sekretaris - Bendahara</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
