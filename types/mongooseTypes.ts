export type User = {
   _id: string;
   username: string;
   email: string;
   phone: string;
   password: string;
   avatar: string;
   role: string;
   refreshToken: string;
   isBanned: boolean;
}


export type Post = {
   _id: string;
   title: string;
   image: string;
   tags: string[];
   user: User;
   comments: Comment[];
   likesCount: number;
   createdAt: string;
   updatedAt: string;
}

export type Comment = {
   _id: string;
   title: string;
   image: string;
   tags: string[];
   user: User;
   post: Post;
   likesCount: number;
   parentComment?: Comment;
   hasReply: boolean;
   createdAt: string;
   updatedAt: string;
}

export type Like = {
   _id: string;
   user: User;
   post: Post | Comment;
}