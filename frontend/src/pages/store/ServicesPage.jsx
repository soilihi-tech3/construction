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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {services.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";
              }}
            >
              {/* Photo du service */}
              <div 
                style={{ height: 210, position: "relative", cursor: "pointer", overflow: "hidden" }}
                onClick={() => openServiceModal(s)}
              >
                <img
                  src={s.imageUrl}
                  alt={s.nom}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)",
                  display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "18px"
                }}>
                  <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>
                    {s.nom}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                    {s.tarif || "Sur devis gratuit"}
                  </div>
                </div>
              </div>

              {/* Description & Détails */}
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                    {s.description}
                  </p>

                  {/* Conditions */}
                  {s.conditions && (
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} color="#EA580C" /> Conditions & Zones
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.45 }}>
                        {s.conditions}
                      </div>
                    </div>
                  )}

                  {/* Responsable */}
                  {s.chefNom && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                      <HardHat size={16} color="#0F766E" /> Responsable : {s.chefNom}
                    </div>
                  )}

                  {/* Miniatures réalisations */}
                  {Array.isArray(s.photosRealisation) && s.photosRealisation.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>
                        Chantiers réalisés ({s.photosRealisation.length}) :
                      </div>
                      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                        {s.photosRealisation.map((pUrl, pIdx) => (
                          <img
                            key={pIdx}
                            src={pUrl}
                            alt={`Chantier ${pIdx + 1}`}
                            onClick={() => setSelectedImagePreview(pUrl)}
                            style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", cursor: "pointer", border: "1px solid var(--line)" }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton Contact WhatsApp Direct */}
                {(() => {
                  const phone = (s.chefTelephone || boutique?.whatsappNumber || boutique?.telephone || "+269 333 00 00").replace(/[^0-9]/g, "");
                  const msg = `Bonjour,\n\nJe suis intéressé par votre service de : *${s.nom}*.\nTarif indicatif : ${s.tarif || "Sur devis"}.\nPouvez-vous me donner plus d'informations pour mon projet aux Comores ?`;
                  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

                  return (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        background: "#16A34A",
                        color: "#fff",
                        padding: "12px 18px",
                        borderRadius: 12,
                        fontWeight: 800,
                        fontSize: 14,
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)"
                      }}
                    >
                      <MessageCircle size={18} /> Demander un devis sur WhatsApp
                    </a>
                  );
                })()}
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
