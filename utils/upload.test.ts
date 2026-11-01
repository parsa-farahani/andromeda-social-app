import { describe, it, expect } from "vitest";
import { detectImage } from "./media/upload";


describe("detectImage", () => {

   it("detects PNG", () => {

      const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);

      expect(detectImage(png)).toBe("png");
   });


   it("detects JPEG", () => {

      const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      expect(detectImage(jpg)).toBe("jpg");
   });


   it("rejects non-images (e.g: HTML/SVG disguised as image)", () => {

      const invalid = Buffer.from("<svg onload=alert(1)>");
      expect(detectImage(invalid)).toBeNull();
   });
});