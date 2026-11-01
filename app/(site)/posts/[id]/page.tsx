import Header from "@/components/modules/Header/Header";
import PostActions from "@/components/templates/p-admin/posts/PostActions";
import PostComments from "@/components/templates/posts/PostComments";
import PostImage from "@/components/templates/posts/PostImage";
import { Button } from "@/components/ui/button";
import connectToDB from "@/configs/db";
import LikeModel from "@/models/Like";
import PostModel from "@/models/Post";
import type { Like, Post } from "@/types/mongooseTypes";
import { attachIsLiked } from "@/utils/likes";
import { getPostComments } from "@/utils/pagedFetch/comments";
import { authUser } from "@/utils/serverHelpers";
import { Dot, Heart } from "lucide-react";
import { isValidObjectId } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Post = async (
   { params }
   : {
      params: Promise<{ id: string }>;
   }
) => {
   const { id } = await params;

   if (!isValidObjectId(id)) {
      redirect('/')
   }

   await connectToDB();

   const user = await authUser();

   const postDoc: Post = await PostModel.findOne({
      _id: id,
   })
      .populate("user", "avatar username")
      .lean();

   if (!postDoc) {
      redirect('/');
   }

   const plainPost: Post = JSON.parse(JSON.stringify(postDoc));

   const [post] = await attachIsLiked([plainPost], user?._id);


   const { comments, nextCursor } = await getPostComments(post._id, null, user?._id);

   const likedIdsDocs = await LikeModel.find(
      {
         user: user?._id,
      },
      "_id post"
   )
   .lean()

   const likedIds = JSON.parse(JSON.stringify(likedIdsDocs)).map((l: Like) => l.post);

   await new Promise((res) => setTimeout(res, 2000))

   return (
      <>
         <Header isLoggedIn={Boolean(user)} user={user} />
         <div className="container">
            <section>
               <div className="h-20 flex gap-5 items-center">
                  <div className="size-12 rounded-full overflow-clip">
                     <Image
                        src={post.user?.avatar ?? "/images/users/avatar.png"}
                        width={100}
                        height={100}
                        alt="user avatar"
                     />
                  </div>

                  <div className="flex items-center gap-3">
                     <p className="h-full font-semibold text-md ">
                        {post.user?.username}
                     </p>

                     <div className=" ">
                        <Dot className="size-[20px] text-gray-500" />
                     </div>

                     <p className="text-gray-500 text-sm">
                        <time dateTime={post.createdAt}>
                           {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                           )}
                        </time>
                     </p>
                  </div>
               </div>
            </section>

            <section className="py-3 border-b">
               {post?.image ? (
                  <PostImage image={post.image} title={post.title} />
               ) : null}

               <h2 className="text-lg">{post.title}</h2>

               {post.tags && post.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                     {post.tags.map((tag) => (
                        <Link
                           key={tag}
                           href={`/search?tag=${tag}`}
                           className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm"
                        >
                           #{tag}
                        </Link>
                     ))}
                  </div>
               ) : null}

               <PostActions post={post} />
            </section>

            {/* Comments  */}
            <PostComments
               key={comments[0]?._id ?? "empty"}
               initialComments={JSON.parse(JSON.stringify(comments))}
               initialCursor={nextCursor}
               postId={post._id}
               user={user}
               likedIds={likedIds}
            />
         </div>
      </>
   );
};

export default Post;
