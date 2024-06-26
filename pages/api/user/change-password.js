import { findDocument, updateDocument } from "../../../lib/mongodb";
import { getToken } from "next-auth/jwt";
import { verifyPassword, hashPassword } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    // const session = await getSession({ req });
    // if (!session) {
    //   res.status(401).json({ message: "Not authenticated" });
    //   return;
    // }

    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const userEmail = token.email;
    if (!userEmail) {
      res.status(401).json({ message: "User email not found in token" });
      return;
    }

    let response = await findDocument("users", { email: userEmail });

    if (!response.success) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { newPassword, oldPassword } = req.body;
    if (newPassword === oldPassword) {
      res.status(422).json({ message: "New password cannot be the same as the old password" });
      return;
    }

    if (await verifyPassword(oldPassword, response.document.password) === false) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }

    response = await updateDocument("users", { email: userEmail }, { password: await hashPassword(newPassword) });
    if (!response.success) {
      res.status(500).json({ message: response.message || "Password update failed" });
      return;
    }

    res.status(200).json({ message: "Password updated" });
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}