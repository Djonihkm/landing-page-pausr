// ============================================================
// /api/feedback — reçoit les avis utilisateurs
// TODO: brancher sur Brevo transactionnel ou une liste dédiée
// ============================================================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  // TODO: envoyer par email ou stocker en base
  // Exemple : POST https://api.brevo.com/v3/smtp/email
  console.log(`[feedback] ${name}: ${message}`);

  return res.status(200).json({ ok: true });
}
