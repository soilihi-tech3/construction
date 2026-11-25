import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, ShieldCheck, Truck, Sparkles, Phone, MapPin, Mail, ArrowRight, Award, Check, Package, Shield, HeartHandshake, HardHat, Building, Layers, CheckCircle2, ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import api, { SLUG } from "../../api";

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId = null;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setCount(Math.floor(ease * end));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <>{count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</>;
}

export default function About() {
  const [boutique, setBoutique] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [photoSlideIdx, setPhotoSlideIdx] = useState(0);

  useEffect(() => {
    api.get(`/store/${SLUG}`).then(res => setBoutique(res.data)).catch(() => {});
  }, []);

  const dynamicHeroBanner = boutique?.aProposBannerUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=1600&q=80";
  const dynamicAboutImage = boutique?.aProposImageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80";

  const PROJETS_REALISES = [
    {
      titre: "Villa contemporaine à Moroni",
      type: "Gros œuvre & Maçonnerie",
      lieu: "Moroni, Ngazidja",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "Fondations, élévation des murs et coulage de dalle béton armé avec fer à béton HA 12."
    },
    {
      titre: "Coulage de dalle & ferraillage",
      type: "Béton armé & Fondations",
      lieu: "Région de Mboude",
      img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
      description: "Livraison de 4 camions de gravier 8m³ et 120 sacs de ciment Portland pour dalle supérieure."
    },
    {
      titre: "Rénovation & Peinture de façade",
      type: "Finition & Peinture",
      lieu: "Itsandra, Comores",
      img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      description: "Traitement anti-humidité tropicale, enduit de lissage et peinture mate haute résistance."
    },
    {
      titre: "Installation électrique complète",
      type: "Électricité Bâtiment",
      lieu: "Bambao, Ngazidja",
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      description: "Tableau divisionnaire, câblage sécurisé et mise aux normes pour résidence privée."
    }
  ];

  return (
    <div style={{ paddingBottom: 60, maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        .modern-service-card {
          background: var(--card, #fff);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border: 1px solid var(--line);
        }
        .modern-service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* BANNIÈRE HÉRO À PROPOS */}
      <div className="bs-about-hero" style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        minHeight: 260,
        margin: "16px 0 36px",
        backgroundImage: `url('${dynamicHeroBanner}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        padding: "44px 20px"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.92))" }}></div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
            padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14
          }}>
            <HardHat size={15} color="#FDBA74" /> Notre Histoire & Engagement BTP
          </div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
            À propos de {boutique?.nom || "ETS LIHOMA Matériaux BTP"}
          </h1>
          <p style={{ fontSize: "clamp(14px, 3.5vw, 16.5px)", marginTop: 12, opacity: 0.95, lineHeight: 1.6 }}>
            Votre partenaire de référence aux Comores pour tous vos approvisionnements en matériaux de construction et réalisations de travaux de bâtiment.
          </p>
        </div>
      </div>

      {/* BLOC PRÉSENTATION ET VALEURS */}
      <div className="bs-about-grid" style={{ marginBottom: 48 }}>
        <div>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 800, color: "var(--ink)", marginBottom: 14 }}>
            Qui sommes-nous ?
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--ink)", marginBottom: 20 }}>
            {boutique?.aProposText || 
              "Implantée au cœur des Comores (Mboude & Ngazidja), notre entreprise est spécialisée dans la vente et la livraison directe sur chantier de matériaux de construction de première qualité : sable concassé, gravier par voyage de 8 m³, ciment Portland certifié, fer à béton de tous diamètres (fer de 8, 10, 12, 14, 16), bois et contreplaqué de coffrage, outillage et peintures de finition. Nous mettons également à votre disposition des équipes d'artisans maçons, plombiers, électriciens et peintres chevronnés pour concrétiser vos projets de construction de A à Z avec rigueur et ponctualité."
            }
          </p>
          
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {/* Card 1 */}
            <div className="modern-service-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--forest-dark)", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>
                <ShieldCheck size={20} color="#16A34A" /> Matériaux Certifiés BTP
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Ciments haute résistance et fers à béton testés pour garantir la solidité pérenne de vos bâtisses.
              </p>
            </div>

            {/* Card 2 */}
            <div className="modern-service-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--forest-dark)", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>
                <Truck size={20} color="#2563EB" /> Livraison Camion sur Chantier
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Flotte de camions bennes pour acheminer vos voyages de 8 m³ de sable et gravier partout sur l'île.
              </p>
            </div>

            {/* Card 3 */}
            <div className="modern-service-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--forest-dark)", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>
                <HardHat size={20} color="#EA580C" /> Équipes & Artisans Qualifiés
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Maçons, plombiers et électriciens supervisés par des chefs de chantiers expérimentés.
              </p>
            </div>

            {/* Card 4 */}
            <div className="modern-service-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--forest-dark)", fontWeight: 800, marginBottom: 8, fontSize: 15 }}>
                <Building size={20} color="#0F766E" /> Présence 100% Comores
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                Dépôts de proximité à Mboude et Moroni pour une réactivité optimale et des prix transparents.
              </p>
            </div>
          </div>

          {/* STATS SECTION BTP */}
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16 }}>
            <div className="modern-service-card" style={{ padding: "18px 12px", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#16A34A", marginBottom: 4 }}><CountUp end={1450} />+</div>
              <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 700, lineHeight: 1.3 }}>Chantiers<br/>Livrés</div>
            </div>
            <div className="modern-service-card" style={{ padding: "18px 12px", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#EA580C", marginBottom: 4 }}><CountUp end={28500} />+</div>
              <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 700, lineHeight: 1.3 }}>Tonnes Ciment<br/>& Matériaux</div>
            </div>
            <div className="modern-service-card" style={{ padding: "18px 12px", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#2563EB", marginBottom: 4 }}><CountUp end={5200} />+</div>
              <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 700, lineHeight: 1.3 }}>Voyages Camion<br/>Sable & Gravier</div>
            </div>
            <div className="modern-service-card" style={{ padding: "18px 12px", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#0F766E", marginBottom: 4 }}><CountUp end={12} />+</div>
              <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 700, lineHeight: 1.3 }}>Années<br/>d'Expérience BTP</div>
            </div>
          </div>
        </div>

        {/* IMAGE DYNAMIQUE DE PRÉSENTATION */}
        <div style={{ position: "relative", marginTop: 12, display: "flex", justifyContent: "center" }}>
          <img 
            src={dynamicAboutImage} 
            alt="À propos des chantiers" 
            style={{ 
              width: "100%", 
              maxWidth: 440,
              height: 380, 
              objectFit: "cover", 
              borderRadius: 20, 
              boxShadow: "0 14px 28px rgba(0,0,0,0.12)",
              border: "1px solid var(--line)"
            }} 
          />
        </div>
      </div>

      {/* GALERIE DES PROJETS ET CHANTIERS RÉALISÉS */}
      <div style={{ marginTop: 40, borderTop: "1px solid var(--line)", paddingTop: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ color: "#EA580C", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            Réalisations aux Comores
          </span>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 900, color: "var(--ink)", margin: "8px 0 0" }}>
            Quelques Projets Réalisés avec nos Matériaux
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 640, margin: "8px auto 0" }}>
            Découvrez un aperçu des villas, fondations et travaux de construction approvisionnés et accompagnés par notre entreprise.
          </p>
        </div>

        {(() => {
          const projetsAffiches = (boutique?.projetsRealises && boutique.projetsRealises.length > 0)
            ? boutique.projetsRealises
            : PROJETS_REALISES;

          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
              {projetsAffiches.map((p, idx) => {
                const projectPhotos = Array.isArray(p.photos) && p.photos.length > 0 ? p.photos : (p.img ? [p.img] : []);
                const mainImg = projectPhotos[0] || "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=800&q=80";

                return (
                  <div
                    key={p.id || idx}
                    onClick={() => {
                      setSelectedProject(p);
                      setPhotoSlideIdx(0);
                    }}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--line)",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    }}
                  >
                    <div style={{ height: 190, overflow: "hidden", position: "relative" }}>
                      <img src={mainImg} alt={p.titre || p.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {projectPhotos.length > 1 && (
                        <span style={{
                          position: "absolute", bottom: 10, right: 10,
                          background: "rgba(15, 23, 42, 0.75)", color: "#fff",
                          backdropFilter: "blur(4px)", padding: "4px 10px",
                          borderRadius: 14, fontSize: 11.5, fontWeight: 700,
                          display: "flex", alignItems: "center", gap: 5
                        }}>
                          <ImageIcon size={13} /> {projectPhotos.length} photos (cliquer)
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "16px 18px" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
                        {p.type || "Chantier Réalisé"}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", margin: "4px 0 6px" }}>
                        {p.titre || p.nom}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 10px", lineHeight: 1.45 }}>
                        {p.description}
                      </p>
                      <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={13} color="#EA580C" /> {p.lieu || p.region}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* MODAL SLIDER CAROUSEL JUSQU'À 4 PHOTOS PAR PROJET */}
      {selectedProject && (() => {
        const photos = Array.isArray(selectedProject.photos) && selectedProject.photos.length > 0
          ? selectedProject.photos.slice(0, 4)
          : (selectedProject.img ? [selectedProject.img] : []);
        const totalPhotos = photos.length;
        const currentPhotoUrl = photos[photoSlideIdx] || photos[0];

        return (
          <div
            onClick={() => setSelectedProject(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)", zIndex: 99999,
              display: "flex", alignItems: "center", justifyContent: "center", padding: 16
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0F172A",
                borderRadius: 20,
                width: "100%",
                maxWidth: 850,
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff"
              }}
            >
              {/* Image Principale avec Flèches de défilement */}
              <div style={{ position: "relative", height: "clamp(280px, 50vh, 460px)", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={currentPhotoUrl}
                  alt={`${selectedProject.titre || selectedProject.nom} - Photo ${photoSlideIdx + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />

                {/* Bouton Fermer */}
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    position: "absolute", top: 16, right: 16,
                    width: 38, height: 38, borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", border: "none", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 10
                  }}
                >
                  <X size={20} />
                </button>

                {/* Indicateur N° Photo */}
                {totalPhotos > 1 && (
                  <div style={{
                    position: "absolute", top: 16, left: 16,
                    background: "rgba(0,0,0,0.6)", color: "#fff",
                    padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                    backdropFilter: "blur(4px)"
                  }}>
                    Photo {photoSlideIdx + 1} / {totalPhotos}
                  </div>
                )}

                {/* Flèche Gauche */}
                {totalPhotos > 1 && (
                  <button
                    onClick={() => setPhotoSlideIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1))}
                    style={{
                      position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                      width: 44, height: 44, borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)", border: "none", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", backdropFilter: "blur(6px)", transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                  >
                    <ChevronLeft size={26} />
                  </button>
                )}

                {/* Flèche Droite */}
                {totalPhotos > 1 && (
                  <button
                    onClick={() => setPhotoSlideIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0))}
                    style={{
                      position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                      width: 44, height: 44, borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)", border: "none", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", backdropFilter: "blur(6px)", transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                  >
                    <ChevronRight size={26} />
                  </button>
                )}
              </div>

              {/* Barre de vignettes si plusieurs photos */}
              {totalPhotos > 1 && (
                <div style={{ display: "flex", gap: 10, padding: "12px 20px", background: "#1E293B", overflowX: "auto" }}>
                  {photos.map((ph, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPhotoSlideIdx(idx)}
                      style={{
                        width: 68, height: 50, borderRadius: 8, overflow: "hidden",
                        border: photoSlideIdx === idx ? "2.5px solid #F59E0B" : "1.5px solid transparent",
                        opacity: photoSlideIdx === idx ? 1 : 0.6,
                        cursor: "pointer", flexShrink: 0, transition: "all 0.2s"
                      }}
                    >
                      <img src={ph} alt={`Miniature ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Détails du projet */}
              <div style={{ padding: "20px 24px", background: "#0F172A" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#60A5FA", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {selectedProject.type || "Chantier BTP"}
                    </span>
                    <h3 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 900, color: "#fff" }}>
                      {selectedProject.titre || selectedProject.nom}
                    </h3>
                  </div>
                  <div style={{ fontSize: 13, color: "#FDBA74", background: "rgba(234, 88, 12, 0.2)", padding: "4px 12px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={14} /> {selectedProject.lieu || selectedProject.region}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#94A3B8", lineHeight: 1.6 }}>
                  {selectedProject.description}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
