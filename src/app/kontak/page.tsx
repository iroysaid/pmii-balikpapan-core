import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">Hubungi Kami</h1>
                    <p className="text-secondary max-w-2xl mx-auto">
                        Jangan ragu untuk menghubungi kami jika ada pertanyaan seputar PMII Balikpapan atau informasi kaderisasi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex items-start">
                            <div className="bg-white p-4 rounded-full shadow-md text-accent mr-6">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-2">Alamat Sekretariat</h3>
                                <p className="text-secondary leading-relaxed mb-2">
                                    Jl. Ratte Daeng Nai, Kel. Sepinggan Raya,
                                    Perum. Balikpapan Kota, Gn. Bahagia,
                                    Kecamatan Balikpapan Selatan, Kota Balikpapan,
                                    Kalimantan Timur 76114
                                </p>
                                <a
                                    href="https://maps.app.goo.gl/acFYwLwgVrvWUrZY9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline font-bold text-sm"
                                >
                                    Lihat di Google Maps
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-white p-4 rounded-full shadow-md text-accent mr-6">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-2">Email</h3>
                                <p className="text-secondary">pmiibalikpapan@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-white p-4 rounded-full shadow-md text-accent mr-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-2">Instagram</h3>
                                <a
                                    href="https://www.instagram.com/pmiibalikpapan?igsh=MWxyZGZtd2F4MWh1dA=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary hover:text-accent transition"
                                >
                                    @pmiibalikpapan
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Maps Embed */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg h-[400px] overflow-hidden">
                        <iframe
                            src="https://maps.google.com/maps?q=-1.250806,116.888083&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '1rem' }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Peta Lokasi Sekretariat PMII Balikpapan"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
