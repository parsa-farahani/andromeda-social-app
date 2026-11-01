import { z } from 'zod';

// SignUp Schema
export const signupSchema = z.object(
   {
      username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .regex(
         /^[a-zA-Z_]/,
         "Username must start with a letter or underscore"
      )
      ,

      email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe( z.email("Invalid email address") ),

      password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one (0-9) digit")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
   }
)


export type SignupSchema = z.infer<typeof signupSchema>;



// SignIn Schema
export const signinSchema = z.object(
   {
      identifier: z
      .string()
      .trim()
      .min(1, "Username or Email is required"),

      password: z
      .string()
      .min(1, "Password is required")
   }
)


export type SigninSchema = z.infer<typeof signinSchema>;



// Create-Post Schema
export const postSchema = z.object(
   {
      title: z
      .string()
      .trim()
      .min(1, "Please write something..."),

      user: z
      .string(),
      

      image: z
      .custom<FileList>()
      .optional()
      .refine(
         (files) =>
         !files ||
         files.length === 0 ||
         files[0].type.startsWith("image/"),
         "Please select an image file"
      )
      .refine(
         (files) =>
         !files ||
         files.length === 0 ||
         files[0].size <= 10 * 1024 * 1024,
         "Image size must be less than 10MB"
      ),

      tags: z
         .array(
            z.string()
            .trim()
            .min(1)
            .max(30, "Each tag must be at most 30 characters")
         )
         .max(5, "You can add up to 5 tags")
      ,
      
   }
)


export type PostSchema = z.infer<typeof postSchema>;


// Create-Post Schema (Server Action)
export const postActionSchema = z.object(
   {
      title: z
      .string()
      .trim()
      .min(1, "Please write something..."),

      user: z
      .string(),
      

      image: z
      .file()
      .refine(
         (file) => file.type.startsWith("image/"),
         "Please select an image file"
      )
      .refine(
         (file) => file.size <= 10 * 1024 * 1024,
         "Image size must be less than 10MB"
      )
      .optional()
      ,

      tags: z
         .array(
            z.string()
            .trim()
            .min(1)
            .max(30, "Each tag must be at most 30 characters")
         )
         .max(5, "You can add up to 5 tags")
         .refine(
            (tags) =>
               new Set(tags.map((tag) => tag.toLowerCase())).size === tags.length,
            "Tags must be unique"
         )
      ,
      
   }
)


export type PostActionSchema = z.infer<typeof postActionSchema>;


// Comment Schema
export const commentSchema = z.object(
   {
      title: z
      .string()
      .trim()
      .min(1, "Please write something..."),

      user: z
      .string(),

      post: z
      .string(),

      parentComment: z
      .string()
      .optional(),
      

      image: z
      .custom<FileList>()
      .optional()
      .refine(
         (files) =>
         !files ||
         files.length === 0 ||
         files[0].type.startsWith("image/"),
         "Please select an image file"
      )
      .refine(
         (files) =>
         !files ||
         files.length === 0 ||
         files[0].size <= 10 * 1024 * 1024,
         "Image size must be less than 10MB"
      ),

      tags: z
         .array(
            z.string()
            .trim()
            .min(1)
            .max(30, "Each tag must be at most 30 characters")
         )
         .max(5, "You can add up to 5 tags")
      ,
      
   }
)


export type CommentSchema = z.infer<typeof commentSchema>;


// Create-Post Schema (Server Action)
export const commentActionSchema = z.object(
   {
      title: z
      .string()
      .trim()
      .min(1, "Please write something..."),

      user: z
      .string(),

      post: z
      .string(),

      parentComment: z
      .string()
      .optional(),
      

      image: z
      .file()
      .refine(
         (file) => file.type.startsWith("image/"),
         "Please select an image file"
      )
      .refine(
         (file) => file.size <= 10 * 1024 * 1024,
         "Image size must be less than 10MB"
      )
      .optional()
      ,

      tags: z
         .array(
            z.string()
            .trim()
            .min(1)
            .max(30, "Each tag must be at most 30 characters")
         )
         .max(5, "You can add up to 5 tags")
         .refine(
            (tags) =>
               new Set(tags.map((tag) => tag.toLowerCase())).size === tags.length,
            "Tags must be unique"
         )
      ,
      
   }
)


export type CommentActionSchema = z.infer<typeof commentActionSchema>;



// Edit-Profile Schema
export const profileSchema = z.object(
   {
      username: z
      .string()
      .trim()
      .min(1, "Username is required"),

      email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe( z.email("Invalid email address") ),
      

      avatar: z
      .custom<FileList>()
      .optional()
      .refine(
         (files) =>
         !files ||
         files.length === 0 ||
         files[0].type.startsWith("image/"),
         "Please select an image file"
      )
      .refine(
         (files) =>
         !files ||
         files.length === 0 ||
         files[0].size <= 2 * 1024 * 1024,
         "Image size must be less than 2MB"
      ),
      
   }
)


export type ProfileSchema = z.infer<typeof profileSchema>;


// this schema is used in '/users/[id]' API, to update profile (Back-end schema)
export const profileApiSchema = z.object(
   {
      username: z
      .string()
      .trim()
      .min(1, "Username is required"),

      email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe( z.email("Invalid email address") ),
      

      avatar: z
      .file()
      .refine(
         (file) => !file || file.type.startsWith("image/"),
         "Please select an image file"
      )
      .refine(
         (file) => !file || file.size <= 2 * 1024 * 1024,
         "Image size must be less than 2MB"
      )
      .optional()
      ,
      
   }
)


export type ProfileApiSchema = z.infer<typeof profileApiSchema>;