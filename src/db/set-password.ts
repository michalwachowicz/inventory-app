import { hashPassword } from "../utils/password-utils";
import { initDatabase, updateSecretPassword } from "./queries";

async function setSecretPassword() {
  const password = process.argv[2];
  if (!password) {
    console.error("Correct usage: npm run db:password <password>");
    process.exit(1);
  }

  try {
    console.log("Initializing database...");
    await initDatabase();

    console.log("Hashing password...");
    const hashedPassword = await hashPassword(password);

    console.log("Updating password in the database...");
    await updateSecretPassword(hashedPassword);

    console.log("Password has been updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to set up secret password", error);
    process.exit(1);
  }
}

setSecretPassword();
