import { insertDocument, findDocument } from "../../../lib/mongodb"
import { hashPassword } from "../../../lib/auth";

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), ms));
}

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

    try {
      const response = await Promise.race([
        findDocument('users', { email }), 
        timeout(5000) // 5 seconds timeout
      ]);

      if (response.success) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const hashedPassword = await hashPassword(password)

      await Promise.race([
        insertDocument('users', { email, password: hashedPassword }),
        timeout(5000) // 5 seconds timeout
      ]);

      res.status(200).json({ email, password })
    } catch (error) {
      if (error.message === 'Operation timed out') {
        return res.status(503).json({ message: 'Service unavailable. Please try again later.' });
      }
      // Handle other errors (e.g., database errors)
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}