export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,  // ✅ clé sécurisée
      },
      body: JSON.stringify({
        email: email,
        listIds: [4],
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204) {
      res.status(200).json({ success: true });
    } else {
      const data = await response.json();
      res.status(400).json({ success: false, message: data.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}