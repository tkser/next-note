import bcrypt from "bcrypt";

async function generatePasswordHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}

async function comparePasswordHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export { generatePasswordHash, comparePasswordHash };
