
import InfoHeader from '@/components/templates/p-user/InfoHeader';
import PostsPanel from '@/components/templates/p-user/PostsPanel';
import connectToDB from '@/configs/db';
import CommentModel from '@/models/Comment';
import PostModel from '@/models/Post';
import { Comment, Post } from '@/types/mongooseTypes';
import { attachIsLiked } from '@/utils/likes';
import { authUser } from '@/utils/serverHelpers';
import { redirect } from 'next/navigation';


const PUser = async () => {

  await connectToDB();
  const user = await authUser();

  if (!user) {
    redirect("/signin");
  }

  const postsDocs = await PostModel.find(
    {
      user: user._id,
    },
  )
  .populate("user", "username avatar")
  .sort({ _id: -1 })
  // .limit(4)
  
  const plainPosts = JSON.parse(JSON.stringify(postsDocs));

  const posts = await attachIsLiked<Post>(plainPosts, user?._id)

  const commentsDocs = await CommentModel.find(
    {
      user: user._id,
    }
  )
  .populate("user", "username avatar")
  .sort({ _id: -1 })
  
  const plainComments = JSON.parse(JSON.stringify(commentsDocs));

  const comments = await attachIsLiked<Comment>(plainComments, user._id);

  await new Promise((res) => setTimeout(res, 2000))

  return (
    <>
      <InfoHeader user={user} withEdit />

      <hr className='mb-2 mt-4 md:mt-6 md:mb-3' />

      <section className="grow flex flex-col min-h-0" >
        <PostsPanel user={user} posts={posts} comments={comments} />
      </section>
    </>
  )
}


export default PUser