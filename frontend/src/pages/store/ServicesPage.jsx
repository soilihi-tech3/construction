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

      {/* MODAL DÉTAILS SERVICE BTP COMPLET */}
      {activeModalService && (
        <div
          onClick={() => setActiveModalService(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 24,
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid var(--line)",
              position: "relative"
            }}
          >
            {/* Header image du service */}
            <div style={{ position: "relative", height: 240, overflow: "hidden", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <img 
                src={activeModalService.imageUrl} 
                alt={activeModalService.nom}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.88), transparent 70%)" }} />
              
              <button
                onClick={() => setActiveModalService(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)", border: "none", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(4px)"
                }}
              >
                <X size={20} />
              </button>

              <div style={{ position: "absolute", bottom: 16, left: 22, right: 22 }}>
                <span style={{
                  background: "#EA580C", color: "#fff",
                  padding: "3px 12px", borderRadius: 12,
                  fontSize: 11, fontWeight: 800, textTransform: "uppercase"
                }}>
                  Service Professionnel BTP
                </span>
                <h2 style={{ margin: "6px 0 0", color: "#fff", fontSize: 24, fontWeight: 900, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                  {activeModalService.nom}
                </h2>
              </div>
            </div>

            {/* Contenu */}
            <div style={{ padding: "24px" }}>
              {/* Tarif & Type */}
              <div style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                borderRadius: 14, padding: "14px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 20
              }}>
                <div>
                  <span style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Tarification</span>
                  <div style={{ fontSize: 17, fontWeight: 900, color: "#0F766E", marginTop: 2 }}>
                    {activeModalService.tarif || "Sur devis gratuit"}
                  </div>
                </div>
                <span style={{ background: "#CCFBF1", color: "#0F766E", padding: "5px 12px", borderRadius: 12, fontSize: 12.5, fontWeight: 800 }}>
                  {activeModalService.typeTarif === "journee" ? "Par journée" : activeModalService.typeTarif === "m2" ? "Au m²" : "Sur devis chantier"}
                </span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px" }}>
                  Ce que propose notre entreprise :
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                  {activeModalService.description || "Prestation de haute qualité réalisée par nos artisans BTP expérimentés aux Comores."}
                </p>
              </div>

              {/* Conditions */}
              {activeModalService.conditions && (
                <div style={{ marginBottom: 20, background: "#FEFCE8", border: "1px solid #FEF08A", borderRadius: 14, padding: "14px 16px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: "#854D0E", margin: "0 0 6px" }}>
                    Conditions d'intervention & Déplacements :
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#713F12", lineHeight: 1.5 }}>
                    {activeModalService.conditions}
                  </p>
                </div>
              )}

              {/* Responsable / Chef de chantier */}
              {activeModalService.chefNom && (
                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, border: "1px solid var(--line)" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HardHat size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Responsable de l'équipe</div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink)" }}>{activeModalService.chefNom}</div>
                  </div>
                </div>
              )}

              {/* Photos de Réalisations de ce service */}
              {Array.isArray(activeModalService.photosRealisation) && activeModalService.photosRealisation.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", margin: "0 0 10px" }}>
                    Chantiers et projets déjà réalisés :
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                    {activeModalService.photosRealisation.map((pUrl, pIdx) => (
                      <div 
                        key={pIdx} 
                        onClick={() => setSelectedImagePreview(pUrl)}
                        style={{ height: 100, borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)", cursor: "pointer", position: "relative" }}
                        title="Cliquer pour agrandir"
                      >
                        <img src={pUrl} alt={`Réalisation ${pIdx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton Contact WhatsApp Direct */}
              {(() => {
                const phone = (activeModalService.chefTelephone || boutique?.whatsappNumber || boutique?.telephone || "+269 333 00 00").replace(/[^0-9]/g, "");
                const msg = `Bonjour,\n\nJe souhaite échanger à propos de votre service : *${activeModalService.nom}*.\nTarif indicatif : ${activeModalService.tarif || "Sur devis"}.\nPouvez-vous me renseigner sur vos disponibilités et organiser une visite de chantier ?`;
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
                      gap: 10,
                      background: "#16A34A",
                      color: "#fff",
                      padding: "14px 20px",
                      borderRadius: 14,
                      fontWeight: 800,
                      fontSize: 15,
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
                      transition: "background 0.2s"
                    }}
                  >
                    <MessageCircle size={20} /> Échanger avec le responsable sur WhatsApp
                  </a>
                );
              })()}
            </div>
          </div>
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

