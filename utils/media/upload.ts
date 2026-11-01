import crypto from "crypto";

const SIGNATURES: { ext: string; check: (b: Buffer) => boolean }[] = [

   { 
      ext: "png",
      check: (b) => b.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])) },

   {
      ext: "jpg",
      check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
   },

   { 
      ext: "gif",
      check: (b) => b.subarray(0, 4).toString("ascii") === "GIF8"
   },

   { 
      ext: "webp",
      check: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP"
   },

];



export function detectImage(buffer: Buffer) {
   return SIGNATURES.find((s) => s.check(buffer))?.ext ?? null;
}


export function safeFileName(ext: string) {
   return `${Date.now()}-${crypto.randomUUID()}.${ext}`;
}