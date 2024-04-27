import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Link from "next/link";
import { validateRequest } from "~/server/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Save-spaces",
  description: "Save spaces dot com",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <nav className="flex justify-between">
          <div>
            <Link href="/">Home</Link>
          </div>

          <div>
            {!user && (
              <>
                <Link href="/signup">Signup</Link>
                <Link href="/login">Login</Link>
              </>
            )}
            {user && <span>Hello, {user.username}</span>}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
