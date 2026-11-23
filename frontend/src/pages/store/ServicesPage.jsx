import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HardHat, Phone, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock, MapPin, X, ZoomIn, Sparkles } from "lucide-react";
import api, { SLUG } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function ServicesPage() {
  const { boutique } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalService, setActiveModalService] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  useEffect(() => {
    api.get(`/store/${SLUG}/services`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setServices(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openServiceModal = (s) => {
    setActiveModalService(s);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 0 60px" }}>
      {/* Hero Banner Services */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
        borderRadius: 20,
        padding: "48px 32px",
        color: "#fff",
        textAlign: "center",
        marginBottom: 44,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
          padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14
        }}>
          <HardHat size={16} color="#FDBA74" /> Entreprise BTP & Artisans Qualifiés
        </div>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Nos Services & Travaux de Construction
        </h1>
        <p style={{ fontSize: "clamp(14px, 3.5vw, 17px)", opacity: 0.9, maxWidth: 760, margin: "0 auto", lineHeight: 1.6 }}>
          Nous vous accompagnons dans tous vos projets neufs et rénovations aux Comores : gros œuvre, maçonnerie, électricité, carrelage, peinture et plomberie avec devis gratuit.
        </p>
      </div>

      {/* Grid des services */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
          Chargement de nos services...
        </div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px solid var(--line)" }}>
          <HardHat size={48} color="#94A3B8" style={{ margin: "0 auto 16px" }} />
          <h3>Services en cours d'actualisation</h3>
          <p style={{ color: "var(--muted)" }}>Contactez-nous directement pour vos demandes de travaux.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
          {services.map((s) => (
            <div
              key={s.id}
              onClick={() => openServiceModal(s)}
              style={{
                position: "relative",
                height: 230,
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.18)";
                const img = e.currentTarget.querySelector(".srv-page-img");
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
                const img = e.currentTarget.querySelector(".srv-page-img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src={s.imageUrl}
                alt={s.nom}
                className="srv-page-img"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.45)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                textAlign: "center"
              }}>
                <h2 style={{
                  color: "#ffffff",
                  fontSize: "clamp(26px, 3.5vw, 32px)",
                  fontWeight: 800,
                  margin: "0 0 10px",
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 12px rgba(0,0,0,0.7)"
                }}>
                  {s.nom}
                </h2>
                <div style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: "rgba(0,0,0,0.35)",
                  padding: "6px 16px",
                  borderRadius: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>{s.tarif || "Sur devis gratuit"}</span>
                  <span>·</span>
                  <span style={{ color: "#FDBA74", fontWeight: 700 }}>Voir détails & chantiers →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ZOOM PHOTO RÉALISATION */}
      {selectedImagePreview && (
        <div
          onClick={() => setSelectedImagePreview(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={selectedImagePreview}
              alt="Aperçu Réalisation"
              style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 12, display: "block" }}
            />
            <button
              onClick={() => setSelectedImagePreview(null)}
              style={{
                position: "absolute", top: -14, right: -14,
                width: 36, height: 36, borderRadius: "50%",
                background: "#fff", border: "none", color: "#000",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

