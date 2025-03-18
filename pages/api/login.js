export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    const { password } = req.body;
    if (password === process.env.FRIEND_LOGIN) {
      // Password is correct
      return res.status(200).json({ success: true });
    } else {
      // Wrong password
      return res.status(401).json({ success: false });
    }
  }