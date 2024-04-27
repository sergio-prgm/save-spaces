// import { eq } from "drizzle-orm";
// import Link from "next/link";
//import { db } from "~/server/db";
//import * as schema from "~/server/db/schema";

export default function HomePage() {
  // const session = await getServerAuthSession();
  // console.log(session);
  /*
  const { id: userId } = searchParams;
  const userName = (
    await db
      .select({
        name: schema.users.name,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
  )[0]?.name;
  */
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div>
        <h1>hellou </h1>
      </div>
    </main>
  );
}
