import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2, HardHat, Building } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Contact() {
  const { boutique } = useAuth();
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    email: "",
    sujet: "Demande de devis matériaux",
    message: ""
  });
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.telephone.trim()) {
      toast.error("Veuillez renseigner votre nom et votre numéro de téléphone.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnvoye(true);
      toast.success("Votre message a été transmis à notre équipe !");
    }, 600);
  };

  const storePhone = boutique?.whatsappNumber || boutique?.telephone || "+269 333 00 00";
  const cleanPhone = storePhone.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Bonjour, je souhaite contacter l'entreprise concernant un projet de construction ou une commande de matériaux.")}`;

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 0 60px" }}>
      {/* Hero Banner Contact */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
        borderRadius: 20,
        padding: "48px 32px",
        color: "#fff",
        textAlign: "center",
        marginBottom: 44,
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
          padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14
        }}>
          <Building size={16} color="#FDBA74" /> Équipe & Dépôt aux Comores
        </div>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Contactez Notre Entreprise BTP
        </h1>
        <p style={{ fontSize: "clamp(14px, 3.5vw, 17px)", opacity: 0.9, maxWidth: 720, margin: "0 auto", lineHeight: 1.6 }}>
          Une question sur nos matériaux, nos voyages de sable et gravier, ou un besoin de devis pour un chantier ? Notre équipe est à votre entière disposition.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 32
      }}>
        {/* Colonne 1 : Coordonnées & WhatsApp */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 20,
            padding: "28px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", margin: "0 0 20px" }}>
              Nos Coordonnées
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Adresse */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Adresse Dépôt</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                    {boutique?.adresseRetrait || "Mboude & Ngazidja, Moroni, Comores"}
                  </div>
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F0FDF4", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Téléphone & Devis</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                    {storePhone}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#FFF7ED", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Email Professionnel</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                    {boutique?.emailContact || "contact@ets-lihoma.com"}
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#FAF5FF", color: "#9333EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Horaires d'Ouverture</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                    {boutique?.horairesOuverture || "Du Lundi au Samedi : 07h30 - 18h30"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton WhatsApp Grand Format */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#16A34A",
              color: "#fff",
              borderRadius: 18,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontWeight: 800,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 6px 18px rgba(22, 163, 74, 0.28)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <MessageCircle size={24} /> Échange Direct WhatsApp avec notre Équipe
          </a>
        </div>

        {/* Colonne 2 : Formulaire de contact */}
        <div style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 20,
          padding: "32px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px" }}>
            Envoyez-nous un Message
          </h2>
          <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: 14 }}>
            Remplissez ce formulaire pour recevoir un devis rapide ou des informations sur la disponibilité des matériaux.
          </p>

          {envoye ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px" }}>
                Message bien reçu !
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.5 }}>
                Merci pour votre prise de contact. Notre responsable commercial vous rappellera dans les plus brefs délais.
              </p>
              <button
                onClick={() => {
                  setEnvoye(false);
                  setForm({ nom: "", telephone: "", email: "", sujet: "Demande de devis matériaux", message: "" });
                }}
                className="bs-btn-primary"
                style={{ borderRadius: 12, padding: "10px 24px" }}
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Votre nom complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mohamed Bacar"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 14 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Numéro de téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+269 ..."
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Adresse Email</label>
                  <input
                    type="email"
                    placeholder="nom@exemple.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Objet de votre demande</label>
                <select
                  value={form.sujet}
                  onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 14, background: "#fff" }}
                >
                  <option value="Demande de devis matériaux">Demande de devis matériaux (Sable, gravier, ciment...)</option>
                  <option value="Commande de voyage complet">Commande de voyage camion (8m³ gravier/sable)</option>
                  <option value="Prestation de service BTP">Prestation de service BTP (Maçonnerie, électricité, peinture...)</option>
                  <option value="Suivi de livraison">Suivi d'une livraison sur chantier</option>
                  <option value="Autre demande">Autre demande</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Votre message ou détails de votre chantier *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Précisez la nature des matériaux recherchés, la quantité estimée et la localité aux Comores..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--line)", fontSize: 14, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#0F172A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 24px",
                  fontWeight: 800,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: 6,
                  boxShadow: "0 4px 12px rgba(15,23,42,0.2)"
                }}
              >
                <Send size={18} /> {loading ? "Transmission en cours..." : "Envoyer ma demande"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
