// ============================================================
// /api/feedback — insère un avis dans Supabase
//
// Table SQL à créer dans Supabase > SQL Editor :
//
//   create table feedbacks (
//     id         uuid        default gen_random_uuid() primary key,
//     prenom     text        not null,
//     message    text        not null,
//     created_at timestamptz default now()
//   );
//
// Variables d'env requises (Vercel + .env.local) :
//   SUPABASE_URL          → https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  → clé "service_role" (Settings > API)
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prenom, message } = req.body ?? {};

  if (!prenom?.trim() || !message?.trim()) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[feedback] Variables Supabase manquantes");
    return res.status(500).json({ message: "Configuration serveur incomplète" });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        prenom: prenom.trim(),
        message: message.trim(),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[feedback] Supabase error:", response.status, errText);
      return res.status(500).json({ message: "Erreur lors de l'enregistrement" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[feedback] Fetch error:", err.message);
    return res.status(500).json({ message: "Erreur réseau" });
  }
}
