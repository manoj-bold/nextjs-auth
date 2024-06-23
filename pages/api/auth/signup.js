import { insertDocument } from "../../../lib/mongodb"
import { hashPassword } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Basic password validation - minimum 8 characters
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await hashPassword(password)

    await insertDocument('users', { email, password: hashedPassword })
    res.status(200).json({ email, password })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}