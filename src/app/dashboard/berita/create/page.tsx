import PostForm from "@/components/dashboard/PostForm";
import { prisma } from "@/lib/prisma";

export default async function CreatePostPage() {
    const allTags = await prisma.tag.findMany({ orderBy: { group: "asc" } });

    return (
        <div className="max-w-6xl mx-auto">
            <PostForm allTags={allTags} />
        </div>
    );
}
