import { getSecretPassword } from "../db/queries";
import bcrypt from "bcrypt";

export async function checkPassword(password: string): Promise<boolean> {
  const secretPassword = await getSecretPassword();
  return await bcrypt.compare(password, secretPassword);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
