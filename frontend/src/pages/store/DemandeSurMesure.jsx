import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ClipboardList, Plus, Trash2, HardHat, Send, MessageCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, FileText, 
  Camera, Upload, Clock, Image as ImageIcon, X, AlertCircle, MapPin, Truck
} from "lucide-react";
import api, { SLUG } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const TYPES_PROJET = [
  "Gros Œuvre & Fondations (Sable, Gravier, Ciment, Fer)",
  "Ferraillage & Béton Armé",
  "Maçonnerie & Élévation de murs",
  "Toiture, Charpente & Étanchéité",
  "Menuiserie Bois & Panneaux de coffrage",
  "Plomberie & Réseaux sanitaires",
  "Électricité & Éclairage chantier",
  "Peinture, Carrelage & Finitions",
  "Autre projet ou approvisionnement spécial"
];

const ZONES_COMORES = [
  "Moroni et agglomération",
  "Mboudé (Ntsaweni et environs)",
  "Bambao",
  "Itsandra",
  "Mitsamiouli / Nord",
  "Hamahamet / Mboinkou",
  "Dimani",
  "Badgini",
  "Oichili",
  "Autre région (Ngazidja, Ndzuwani, Mwali)"
];

export default function DemandeSurMesure() {
  const { user, boutique } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [nomClient, setNomClient] = useState(user?.nom || "");
  const [telephoneClient, setTelephoneClient] = useState(user?.telephone || "");
  const [emailClient, setEmailClient] = useState(user?.email || "");
  const [typeProjet, setTypeProjet] = useState(TYPES_PROJET[0]);
  const [zoneLivraison, setZoneLivraison] = useState(ZONES_COMORES[0]);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [articles, setArticles] = useState([
    { id: 1, nom: "Gravier concassé pour béton", quantite: 1, unite: "voyage 8 m³" },
    { id: 2, nom: "Ciment Portland 42.5R", quantite: 50, unite: "sacs 50kg" }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  // Ajouter un article
  function addArticleRow() {
    setArticles(prev => [
      ...prev,
      { id: Date.now() + Math.random(), nom: "", quantite: 1, unite: "unités" }
    ]);
  }

  // Supprimer un article
  function removeArticleRow(id) {
    if (articles.length <= 1) return;
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    if (photos.length > updated.length) {
      setPhotos(prev => prev.slice(0, updated.length));
    }
  }

  function updateArticle(id, field, val) {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  }

  // Compression canvas instantanée
  function compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const MAX_DIM = 900;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.75));
          } catch (err) {
            resolve(e.target.result);
          }
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Sélection de photos
  async function handlePhotoSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxAllowed = Math.max(articles.length, 6);
    const remainingSlots = maxAllowed - photos.length;

    if (remainingSlots <= 0) {
      toast.error(`Vous avez déjà atteint la limite de ${maxAllowed} photos.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const compressed = await Promise.all(filesToProcess.map(f => compressImage(f)));
    setPhotos(prev => [...prev, ...compressed]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nomClient.trim()) {
      toast.error("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!telephoneClient.trim()) {
      toast.error("Veuillez renseigner votre numéro de téléphone (WhatsApp).");
      return;
    }

    const validArticles = articles.filter(a => a.nom.trim().length > 0);
    if (validArticles.length === 0) {
      toast.error("Veuillez préciser au moins un matériau ou article souhaité.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/store/${SLUG}/custom-requests`, {
        nomClient,
        telephoneClient,
        emailClient,
        modeleAppareil: typeProjet,
        typeProjet,
        zoneLivraison,
        delai: "1 à 2 semaines (Livraison Comores)",
        articles: validArticles,
        description,
        photos,
        photoUrl: photos[0] || ""
      });

      if (res.data && res.data.success) {
        setCreatedRequest(res.data.request);
        toast.success("Votre demande de devis a été enregistrée avec succès !");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Erreur soumission demande BTP:", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement de votre demande.");
    } finally {
      setSubmitting(false);
    }
  }

  const phoneBoutique = boutique?.telephone || "2693420808";
  const cleanPhone = phoneBoutique.replace(/[^0-9]/g, "");

  function openWhatsApp(code, reqArticles, reqTypeProjet) {
    const articlesText = (reqArticles || [])
      .map((a, i) => `• ${a.nom} : ${a.quantite} ${a.unite || ""}`.trim())
      .join("\n");

    const storeName = boutique?.nom || "Établissement Lihoma BTP";
    const message = `*DEMANDE DE DEVIS MATÉRIAUX BTP*\nBonjour ${storeName},\n\nJe viens d'enregistrer une demande de matériaux sur votre plateforme.\n\n*Réf Dossier :* ${code}\n*Client :* ${nomClient} (${telephoneClient})\n*Type de projet :* ${reqTypeProjet || typeProjet}\n*Zone de livraison :* ${zoneLivraison}\n*Délai souhaité :* 1 à 2 semaines (Comores)\n\n*Matériaux & Quantités demandés :*\n${articlesText}\n\n${description ? `*Détails complémentaires :* ${description}\n` : ""}Merci de me transmettre votre chiffrage proforma et disponibilité des camions/stocks.`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div style={{ maxWidth: 880, margin: "32px auto 80px", padding: "0 16px" }}>
      {/* ── EN-TÊTE DE LA PAGE ── */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={{
          background: "#FEF3C7", color: "#B45309", border: "1px solid #FDE68A",
          fontSize: 12.5, fontWeight: 800, padding: "6px 14px", borderRadius: 20,
          display: "inline-flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          <HardHat size={14} /> Service Devis & Approvisionnement Spécial BTP
        </span>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900,
          color: "var(--ink)", margin: "14px 0 8px", letterSpacing: "-0.5px"
        }}>
          Commande de Matériaux de Construction Sur-Mesure
        </h1>
        <p style={{
          fontSize: "clamp(14px, 2vw, 16px)", color: "var(--muted)",
          maxWidth: 680, margin: "0 auto", lineHeight: 1.6
        }}>
          Sable noir de carrière, gravier concassé par camion de 8 m³, fers à béton HA de 12, ciment en gros volume ou matériaux spécifiques ? Listez vos besoins, nous vous établissons un devis précis avec livraison directe sur votre chantier aux Comores en 1 à 2 semaines.
        </p>
      </div>

      {/* ── SI LA DEMANDE VIENT D'ÊTRE ENREGISTRÉE (ÉCRAN DE SUCCÈS) ── */}
      {createdRequest ? (
        <div style={{
          background: "#fff", border: "2px solid #22C55E", borderRadius: 24,
          padding: "36px 24px", textAlign: "center", boxShadow: "0 10px 40px rgba(34,197,94,0.12)",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7",
            color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px", boxShadow: "0 4px 12px rgba(22,163,74,0.2)"
          }}>
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--ink)", margin: "0 0 8px" }}>
            Demande de matériaux enregistrée avec succès !
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 20px" }}>
            Votre dossier porte le numéro de référence unique :
          </p>

          <div style={{
            display: "inline-block", background: "#F1F5F9", border: "2px dashed #94A3B8",
            padding: "10px 24px", borderRadius: 14, fontSize: 20, fontWeight: 900,
            fontFamily: "monospace", color: "#1E293B", letterSpacing: "1px", marginBottom: 28
          }}>
            {createdRequest.code}
          </div>

          {/* ACTIONS RAPIDES */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500, margin: "0 auto" }}>
            <button
              onClick={() => openWhatsApp(createdRequest.code, createdRequest.articles, createdRequest.modeleAppareil)}
              style={{
                width: "100%", padding: "14px 20px", borderRadius: 14,
                background: "#25D366", color: "#fff", border: "none",
                fontWeight: 800, fontSize: 15, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 4px 14px rgba(37,211,102,0.35)", transition: "transform 0.15s"
              }}
            >
              <MessageCircle size={20} />
              Transmettre le dossier sur WhatsApp au chef de dépôt
            </button>

            <Link
              to={`/demande/${createdRequest.code}`}
              style={{
                width: "100%", padding: "14px 20px", borderRadius: 14,
                background: "var(--forest)", color: "#fff", textDecoration: "none",
                fontWeight: 800, fontSize: 15, display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 14px rgba(37,99,235,0.25)"
              }}
            >
              <FileText size={18} />
              Suivre l'avancement & Voir la Facture / Devis proforma
            </Link>

            <button
              onClick={() => {
                setCreatedRequest(null);
                setDescription("");
                setPhotos([]);
                setArticles([{ id: Date.now(), nom: "", quantite: 1, unite: "unités" }]);
              }}
              style={{
                background: "transparent", border: "none", color: "var(--muted)",
                fontSize: 13, fontWeight: 600, marginTop: 8, cursor: "pointer"
              }}
            >
              Faire une autre demande de matériaux
            </button>
          </div>
        </div>
      ) : (
        /* ── FORMULAIRE PRINCIPAL ── */
        <form onSubmit={handleSubmit} style={{
          background: "#fff", border: "1px solid var(--line)", borderRadius: 24,
          padding: "clamp(20px, 4vw, 36px)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)"
        }}>
          {/* SECTION 1 : VOS COORDONNÉES */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", background: "var(--forest)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 14
              }}>1</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                Coordonnées du Responsable de Chantier / Client
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              <div className="bs-input-group">
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                  Nom complet ou Entreprise *
                </label>
                <input
                  type="text"
                  className="bs-input"
                  required
                  placeholder="Ex: Soilihi Abdou / BTP Comores"
                  value={nomClient}
                  onChange={(e) => setNomClient(e.target.value)}
                />
              </div>

              <div className="bs-input-group">
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                  Téléphone WhatsApp (pour transmission devis) *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  className="bs-input"
                  required
                  placeholder="Ex: 342 08 08 ou +269 ..."
                  value={telephoneClient}
                  onChange={(e) => setTelephoneClient(e.target.value.replace(/[^0-9+ ]/g, ""))}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 : TYPE DE TRAVAUX & ZONE DE LIVRAISON */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", background: "var(--forest)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 14
              }}>2</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                Type de Travaux BTP & Localisation du Chantier
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div className="bs-input-group">
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                  Nature des travaux / Projet *
                </label>
                <select
                  className="bs-input"
                  value={typeProjet}
                  onChange={(e) => setTypeProjet(e.target.value)}
                  style={{ background: "#fff", cursor: "pointer" }}
                >
                  {TYPES_PROJET.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="bs-input-group">
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                  Zone de livraison aux Comores *
                </label>
                <select
                  className="bs-input"
                  value={zoneLivraison}
                  onChange={(e) => setZoneLivraison(e.target.value)}
                  style={{ background: "#fff", cursor: "pointer" }}
                >
                  {ZONES_COMORES.map((z, idx) => (
                    <option key={idx} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3 : MATÉRIAUX & QUANTITÉS SOUHAITÉS */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--forest)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 14
                }}>3</span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                  Matériaux et volumes demandés ({articles.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={addArticleRow}
                style={{
                  background: "var(--forest-light)", border: "1.5px solid var(--forest)",
                  color: "var(--forest)", fontWeight: 800, fontSize: 12.5,
                  padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6
                }}
              >
                <Plus size={15} /> Ajouter un matériau
              </button>
            </div>

            <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--muted)" }}>
              Précisez le nom du matériau (sable, gravier, fer de 12, ciment, madriers...), la quantité et l'unité (voyages de camion, sacs, barres, m³, litres...).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {articles.map((art, index) => (
                <div key={art.id} style={{
                  display: "grid", gridTemplateColumns: "30px 1fr 100px 130px 40px", alignItems: "center", gap: 10,
                  background: "#F8FAFC", padding: "12px 14px", borderRadius: 14,
                  border: "1px solid #E2E8F0"
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#64748B" }}>
                    #{index + 1}
                  </span>

                  <div>
                    <input
                      type="text"
                      className="bs-input"
                      placeholder="Ex: Sable noir concassé / Fer HA 12"
                      required
                      value={art.nom}
                      onChange={(e) => updateArticle(art.id, "nom", e.target.value)}
                      style={{ background: "#fff", width: "100%" }}
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1"
                      className="bs-input"
                      required
                      value={art.quantite}
                      onChange={(e) => updateArticle(art.id, "quantite", Number(e.target.value) || 1)}
                      style={{ textAlign: "center", background: "#fff", width: "100%" }}
                      placeholder="Qté"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      className="bs-input"
                      placeholder="Ex: 8 m³, sacs, barres"
                      value={art.unite || ""}
                      onChange={(e) => updateArticle(art.id, "unite", e.target.value)}
                      style={{ background: "#fff", width: "100%", fontSize: 13 }}
                    />
                  </div>

                  <div>
                    {articles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArticleRow(art.id)}
                        title="Supprimer cette ligne"
                        style={{
                          background: "#FEE2E2", border: "none", color: "#DC2626",
                          width: 36, height: 36, borderRadius: 10, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4 : PRÉCISIONS & PHOTOS DU CHANTIER / PLANS */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: "1px solid var(--line)", paddingBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--forest)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 14
                }}>4</span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                  Plans de chantier, Devis existant ou Précisions (Facultatif)
                </h3>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 12,
                background: "#EFF6FF", color: "#1D4ED8"
              }}>
                {photos.length} photo{photos.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="bs-input-group" style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                Détails sur l'accès au chantier ou spécifications techniques
              </label>
              <textarea
                className="bs-input"
                style={{ minHeight: 85, resize: "vertical", lineHeight: 1.5 }}
                placeholder="Ex: Chantier accessible aux camions 6 roues, déchargement prévu au dépôt, livraison urgente en 1 semaine..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* GRILLE DES PHOTOS EXISTANTES */}
            {photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12, marginBottom: 14 }}>
                {photos.map((src, index) => (
                  <div key={index} style={{
                    position: "relative", borderRadius: 12, overflow: "hidden",
                    border: "1.5px solid var(--line)", background: "#F8FAFC",
                    aspectRatio: "1 / 1"
                  }}>
                    <img 
                      src={src} 
                      alt={`Document ${index + 1}`} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      title="Supprimer cette photo"
                      style={{
                        position: "absolute", top: 6, right: 6, background: "#EF4444",
                        color: "#fff", border: "none", width: 26, height: 26, borderRadius: "50%",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                style={{ display: "none" }}
                id="photo-upload-input"
              />
              <label
                htmlFor="photo-upload-input"
                style={{
                  border: "2px dashed #CBD5E1", borderRadius: 14, padding: "20px 16px",
                  background: "#F8FAFC", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8,
                  cursor: "pointer", transition: "all 0.15s", textAlign: "center"
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "#EFF6FF",
                  color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Camera size={22} />
                </div>
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#1E293B" }}>
                    + Joindre un plan de masse, devis ou photo de chantier
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--muted)" }}>
                    Formats acceptés : JPG, PNG (compression automatique rapide)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* DÉLAIS DE LIVRAISON : COMORES 1 À 2 SEMAINES */}
          <div style={{
            background: "#F8FAFC", border: "1.5px solid #E2E8F0",
            borderRadius: 18, padding: "18px 20px", marginBottom: 22,
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Clock size={18} color="var(--forest)" />
              <span style={{ fontSize: 14.5, fontWeight: 800, color: "#1E293B" }}>
                Délais d'approvisionnement & Livraison aux Comores
              </span>
            </div>

            <div style={{
              background: "#F0FDF4", border: "1px solid #BBF7D0",
              borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14
            }}>
              <Truck size={28} color="#16A34A" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Chantiers aux Comores (Grande Comore & Îles)
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#15803D", marginTop: 2 }}>
                  1 à 2 semaines maximum
                </div>
              </div>
            </div>

            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#64748B", lineHeight: 1.45 }}>
              Notre dépôt central coordonne les rotations de camions et l'approvisionnement direct des carrières et usines partenaires pour vous livrer aux meilleurs tarifs.
            </p>
          </div>

          {/* BOUTON D'ENVOI */}
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
            <button
              type="submit"
              disabled={submitting}
              className="bs-btn-primary"
              style={{
                width: "100%", padding: "16px 24px", borderRadius: 16,
                fontSize: 16, fontWeight: 900, display: "flex",
                alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 6px 20px rgba(37,99,235,0.25)"
              }}
            >
              <Send size={18} />
              {submitting ? "Transmission en cours..." : "Transmettre ma demande de devis au dépôt"}
            </button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
              Vous recevrez une estimation proforma détaillée avec devis officiel et contact du chef de chantier.
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
