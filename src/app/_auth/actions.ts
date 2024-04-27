import { db } from "~/server/db";
// import { Argon2id } from "oslo/password";
import { verify, hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "~/server/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import * as schema from "~/server/db/schema";

export async function signup(formData: FormData) {
  "use server";
  const username = formData.get("username");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }
  const hashedPassword = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    parallelism: 1,
    // memorySize: 19456,
    // iterations: 2,
    // tagLength: 32,
    // parallelism: 1
  });

  // const hashedPassword = await new Argon2id().hash(password);
  const userId = generateIdFromEntropySize(10); // 16 characters long
  const publicId = `pid_${userId}`;
  const email = () => {
    return `${username}@${createRandomString(5)}.${createRandomTLD()}`;
  };

  // TODO: check if username is already used
  const result = await db
    .insert(schema.users)
    .values({
      id: userId,
      publicId: publicId,
      email: email(),
      username: username,
      hashedPassword: hashedPassword,
    })
    .returning();

  console.log("inserted user", result);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  console.log("cookie", sessionCookie);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

type Result = {
  errors: {
    username?: string[];
    password?: string[];
  };
};

export async function login(
  _prevState: Result,
  formData: FormData,
): Promise<Result> {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      errors: {
        username: ["invalid username"],
      },
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      errors: {
        password: ["Invalid password"],
      },
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username.toLowerCase()),
  });

  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      errors: {
        username: ["Incorrect username or password"],
      },
    };
  }

  const validPassword = await verify(existingUser.hashedPassword!, password, {
    memoryCost: 19456,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      errors: {
        username: ["Incorrect username or password"],
      },
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

function createRandomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function createRandomTLD() {
  const TLDs = ["com", "es", "net", "org"];
  return TLDs[Math.floor(Math.random() * TLDs.length)];
}
