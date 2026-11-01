import { describe, it, expect } from "vitest";
import { sign } from "jsonwebtoken";
import { generateAccessToken, verifyAccessToken } from "./auth";

describe("access token generation & verification", () => {

   it("verifies a token it generated", () => {

      const token = generateAccessToken({ email: "a@x.com" });
      expect(verifyAccessToken(token)?.email).toBe("a@x.com");
   });


   it("rejects a token signed with another secret", () => {

      const token = sign({ email: "a@x.com" }, "other-secret");

      expect(verifyAccessToken(token)).toBeNull();
   });

   

   it("rejects an expired token", () => {

      const expired = sign({ email: "a@x.com" }, "test-access-secret", { expiresIn: -10 });

      expect(verifyAccessToken(expired)).toBeNull();
   });

   
   it("rejects garbage", () => {
      expect(verifyAccessToken("not-a-token")).toBeNull();
   });
});