import PostForm from "@/components/dashboard/PostForm";

export default function CreatePostPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary">Tulis Berita Baru</h1>
                <p className="text-secondary text-sm">Bagikan informasi terbaru kegiatan PMII.</p>
            </div>

            <PostForm />
        </div>
    );
}
