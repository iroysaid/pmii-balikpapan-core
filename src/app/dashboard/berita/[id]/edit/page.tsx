import { prisma } from "@/lib/prisma";
import PostForm from "@/components/dashboard/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [post, allTags] = await Promise.all([
        prisma.post.findUnique({
            where: { id },
            include: {
                tags: { include: { tag: true } },
            },
        }),
        prisma.tag.findMany({ orderBy: { group: "asc" } }),
    ]);

    if (!post) notFound();

    return (
        <div className="max-w-6xl mx-auto">
            <PostForm
                initialData={{
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    image: post.image,
                    published: post.published,
                    tags: post.tags,
                }}
                isEdit={true}
                allTags={allTags}
            />
        </div>
    );
}
