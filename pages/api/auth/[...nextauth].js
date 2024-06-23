import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { findDocument } from "../../../lib/mongodb";

export default NextAuth({
  providers: [
    Credentials({
      async authorize({ email, password }) {
        const response = await findDocument("users", { email });
        if (!response.success) {
          throw new Error("User not found");
        } else {
          const user = response.document;
          if (await verifyPassword(password, user.password)) {
            return { email: user.email };
          } else {
            throw new Error("Invalid password");
          }
        }
      },
    }),
  ]
});