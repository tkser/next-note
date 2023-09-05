import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}

async function comparePasswordHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

async function generateJWT(payload: JWTPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return await jwt.sign(payload, secret, { expiresIn: "1d" });
}

async function verifyJWT(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return (await jwt.verify(token, secret)) as JWTPayload;
}

export { generatePasswordHash, comparePasswordHash, generateJWT, verifyJWT };
