import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";


const UPLOADS_ROOT = path.join(process.cwd(), "uploads") + path.sep;


const TYPES: Record<string, string> = {
   ".jpg": "image/jpeg",
   ".png": "image/png",
   ".gif": "image/gif",
   ".webp": "image/webp",
};

export async function GET(
   req: NextRequest,
   { params }: {
      params: Promise<{
         path: string[];
      }>
   }
) {

   const { path: parts } = await params;
   
   const filePath = path.join( process.cwd(), "uploads", ...parts );

   // to avoid path-traversal
   if (!filePath.startsWith(UPLOADS_ROOT)) {
      return NextResponse.json(
         {
            message: "Not Found"
         },
         { status: 404 }
      )
   }

   // Checking the '.ext' of requested-file
   // If the requested file is not image, returns 404
   const type = TYPES[path.extname(filePath).toLowerCase()];

   if (!type) return new NextResponse("Not found", { status: 404 });


   try {

      const file = await readFile(filePath);

      return new NextResponse(
         file,
         {
            headers: {
               "Content-Type": type,
               "Cache-Control": "public, max-age=31536000, immutable",
               "X-Content-Type-Options": "nosniff",
            },
         }
      );

   } catch(error) {

      console.log('🔴 Error - file API -> ', error)

      return new NextResponse("Internal Server Error", { status: 500 });
   }
}