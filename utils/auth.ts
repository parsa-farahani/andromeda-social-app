import { compare, hash } from "bcryptjs"
import { JwtPayload, sign, verify } from 'jsonwebtoken'

// Hash Passwrod
const hashPassword = async (password: string) => {

   const hashedPassword = await hash(password, 12);

   return hashedPassword;
}


const verifyPassword = async (password: string, hashedPassword: string) => {

   const isValid = await compare(password, hashedPassword);

   return isValid;
}


// Token
const generateAccessToken = (data: {email: string}) => {

   const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
   
   if (!secret) {
      throw new Error("Not Access-Token Secret");
   }

   const token = sign({...data}, secret, {
      expiresIn: '15m',
   });

   return token;
}


type AccessTokenPayload = JwtPayload & {
   email: string;
}

const verifyAccessToken = (token: string): AccessTokenPayload | null => {

   const secret = process.env.ACCESS_TOKEN_SECRET_KEY;

   try {

      if (!secret) {
         throw new Error("No Access-Token Secret");
      }

      const tokenPayload = verify(token, secret);

      if (
         typeof tokenPayload === "string" ||
         typeof tokenPayload.email !== "string"
      ) {
         return null;
      }
      
      return tokenPayload as AccessTokenPayload;
   } catch (error) {
      
      console.log(`🔴 Error - verifyAccessToken -> ${error}`);
      return null;
   }
}


const generateRefreshToken = (data: {email: string}) => {

   const secret = process.env.REFRESH_TOKEN_SECRET_KEY;
   
   if (!secret) {
      throw new Error("no Refresh-Token Secret");
   }

   const token = sign({...data}, secret, {
      expiresIn: '15d',
   });

   return token;
}


type RefreshTokenPayload = JwtPayload & {
   email: string;
}

const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {

   const secret = process.env.REFRESH_TOKEN_SECRET_KEY;

   try {

      if (!secret) {
         throw new Error("No Refresh-Token Secret");
      }

      const tokenPayload = verify(token, secret);

      if (
         typeof tokenPayload === "string" ||
         typeof tokenPayload.email !== "string"
      ) {
         return null;
      }
      
      return tokenPayload as RefreshTokenPayload;
   } catch (error) {
      
      console.log(`🔴 Error - verifyAccessToken -> ${error}`);
      return null;
   }
}


export {
   hashPassword,
   verifyPassword,
   generateAccessToken,
   verifyAccessToken,
   generateRefreshToken,
   verifyRefreshToken,
}