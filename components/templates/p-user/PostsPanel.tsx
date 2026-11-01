'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import PostsList from "./PostsList";
import CommentsList from "./CommentsList";
import { Comment, Post, User } from "@/types/mongooseTypes";


interface PostsPanelProps {
   user: User;
   posts: (Post & { isLiked: boolean})[];
   comments: (Comment & { isLiked: boolean })[];
}

const PostsPanel = (
   { user, posts, comments }
   : PostsPanelProps) => {

   const [currentContent, setCurrentContent] = useState("posts");

   const handleValueChange = (value: string) => {
      setCurrentContent(value);
   }

  return (
      <div className="grow-1 flex flex-col min-h-[700px]" >
         <Tabs
            value={currentContent} 
            onValueChange={handleValueChange}
            >
            <TabsList
               variant="line"
               className="w-full h-12! md:h-15!"
            >
            <TabsTrigger
               value="posts"
                  className="cursor-pointer md:text-lg"
               >
                  Posts
            </TabsTrigger>
            <TabsTrigger value="comments"
               className="cursor-pointer md:text-lg"
               >
                  Comments
            </TabsTrigger>
            </TabsList>
         </Tabs>

         <div
            className="mt-8 grow flex flex-col min-h-0"
         >
            {
               (currentContent === 'posts')
               ? (
               <PostsList user={user} posts={posts} />
               ) : (currentContent === 'comments') ? (
                  <CommentsList comments={comments} />
               ) : null
            }
         </div>
      </div>
  )
}


export default PostsPanel;