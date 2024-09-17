import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "user" | "admin";
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }

  interface Account {
    user: {
      id: number;
      role: "user" | "admin";
    };
  }

  interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "user" | "admin";
  }
}
