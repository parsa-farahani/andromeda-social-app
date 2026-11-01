import LikeModel from "@/models/Like";

export async function attachIsLiked<T extends { _id: string }>(
   posts: T[],
   userId?: string | null
): Promise<(T & { isLiked: boolean })[]> {

   if (!userId || posts.length === 0) {
      return posts.map((p) => ({ ...p, isLiked: false }));
   }

   // likes of current-user
   const likes = await LikeModel.find(
      {
         user: userId,
         post: { $in: posts.map((p) => p._id) }
      },
      "post"
   ).lean();

   const likedIds = new Set(likes.map((l) => String(l.post)));

   return posts.map((p) => ({ ...p, isLiked: likedIds.has(String(p._id)) }));
}