// ============================================================
// FEEDBACK FORM → Supabase
// ============================================================
document.getElementById("feedback-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const prenomEl  = document.getElementById("feedback-name");
  const messageEl = document.getElementById("feedback-message");
  const successEl = document.getElementById("feedback-success");
  const errorEl   = document.getElementById("feedback-error");
  const btn       = e.target.querySelector('button[type="submit"]');

  const prenom  = prenomEl.value.trim();
  const message = messageEl.value.trim();

  if (!prenom || !message) return;

  // Reset état précédent
  errorEl.style.display = "none";

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = "Envoi en cours...";

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, message }),
    });

    if (response.ok) {
      // Message personnalisé avec le prénom
      successEl.textContent = `Merci ${prenom} ! On lit chaque message 🙏`;
      e.target.style.display = "none";
      successEl.style.display = "block";
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Erreur serveur");
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = originalText;
    errorEl.textContent = `⚠️ ${err.message || "Une erreur est survenue. Réessaie dans quelques secondes."}`;
    errorEl.style.display = "block";
    console.error("[feedback]", err.message);
  }
});

// ============================================================
// Compteur d'inscrits affiché (doit correspondre au HTML)
// ============================================================
let count = 147;

// ============================================================
// SCROLL REVEAL
// ============================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((r) => observer.observe(r));

// ============================================================
// INSCRIPTION — envoie l'email à Brevo
// ============================================================
async function subscribe(inputId, successId, errorId) {
  const input = document.getElementById(inputId);
  const success = document.getElementById(successId);
  const error = document.getElementById(errorId);
  const btn = input.nextElementSibling;
  const email = input.value.trim();

  // Validation basique
  if (!email || !email.includes("@")) {
    input.style.borderColor = "rgba(255,80,80,0.5)";
    setTimeout(() => (input.style.borderColor = ""), 1500);
    return;
  }

  // État de chargement
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = "Inscription...";

  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok || response.status === 204) {
      // Succès
      input.closest(".form-wrap").style.display = "none";
      success.style.display = "block";

      // Incrémenter le compteur
      count++;
      document.getElementById("count").textContent = count;
    } else {
      const data = await response.json();
      throw new Error(data.message || "Erreur inconnue");
    }
  } catch (err) {
    // Afficher l'erreur
    btn.disabled = false;
    btn.textContent = originalText; // restaure le texte original du bouton
    error.style.display = "block";
    console.error("Brevo error:", err.message);
  }
}