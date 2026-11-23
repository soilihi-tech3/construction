import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, HardHat, Phone, MessageCircle, Image, Check, X, Eye, EyeOff, Layers, ExternalLink } from "lucide-react";
import api from "../../api";
import { toast } from "react-hot-toast";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    nom: "",
    tarif: "Sur devis gratuit",
    typeTarif: "devis",
    chefNom: "",
    chefTelephone: "",
    chefEmail: "",
    imageUrl: "",
    description: "",
    conditions: "",
    photosRealisation: [],
    ordre: 0,
    actif: true
  };

  const [form, setForm] = useState(initialForm);
  const [newPhotoRealisation, setNewPhotoRealisation] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/services");
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm(initialForm);
    setNewPhotoRealisation("");
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      nom: service.nom || "",
      tarif: service.tarif || "Sur devis gratuit",
      typeTarif: service.typeTarif || "devis",
      chefNom: service.chefNom || "",
      chefTelephone: service.chefTelephone || "",
      chefEmail: service.chefEmail || "",
      imageUrl: service.imageUrl || "",
      description: service.description || "",
      conditions: service.conditions || "",
      photosRealisation: Array.isArray(service.photosRealisation) ? [...service.photosRealisation] : [],
      ordre: service.ordre || 0,
      actif: service.actif !== false
    });
    setNewPhotoRealisation("");
    setModalOpen(true);
  };

  const handleAddPhotoRealisation = () => {
    if (!newPhotoRealisation.trim()) return;
    setForm(prev => ({
      ...prev,
      photosRealisation: [...prev.photosRealisation, newPhotoRealisation.trim()]
    }));
    setNewPhotoRealisation("");
  };

  const handleRemovePhotoRealisation = (index) => {
    setForm(prev => ({
      ...prev,
      photosRealisation: prev.photosRealisation.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim()) {
      toast.error("Le nom du service est requis");
      return;
    }

    try {
      setSubmitting(true);
      if (editingService) {
        await api.put(`/admin/services/${editingService.id}`, form);
        toast.success("Service BTP mis à jour avec succès !");
      } else {
        await api.post("/admin/services", form);
        toast.success("Nouveau service BTP créé avec succès !");
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement du service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le service "${nom}" ?`)) return;
    try {
      await api.delete(`/admin/services/${id}`);
      toast.success("Service supprimé");
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActif = async (service) => {
    try {
      const updated = !service.actif;
      await api.put(`/admin/services/${service.id}`, { actif: updated });
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, actif: updated } : s));
      toast.success(updated ? "Service activé sur le site" : "Service masqué");
    } catch (err) {
      toast.error("Erreur lors de la modification");
    }
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1280, margin: "0 auto" }}>
      {/* En-tête de page */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--ink)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <HardHat size={28} color="#EA580C" /> Gestion des Services BTP & Artisans
          </h1>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14 }}>
            Configurez les prestations de construction proposées, leurs tarifs, les conditions et les photos de chantiers réalisés.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            background: "#16A34A",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 20px",
            fontWeight: 800,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
          }}
        >
          <Plus size={18} /> Ajouter un service BTP
        </button>
      </div>

      {/* Liste des services */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
          Chargement des services...
        </div>
      ) : services.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 48, textAlign: "center" }}>
          <HardHat size={48} color="#94A3B8" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ margin: 0, color: "var(--ink)" }}>Aucun service enregistré</h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
            Ajoutez votre premier service de construction (Maçonnerie, Électricité, Plomberie, Peinture...).
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                opacity: service.actif ? 1 : 0.65
              }}
            >
              {/* Image principale */}
              <div style={{ height: 160, position: "relative", overflow: "hidden", background: "#F1F5F9" }}>
                <img
                  src={service.imageUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=800&q=80"}
                  alt={service.nom}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
                  <button
                    onClick={() => toggleActif(service)}
                    title={service.actif ? "Actif (Cliquer pour masquer)" : "Masqué (Cliquer pour activer)"}
                    style={{
                      background: service.actif ? "rgba(22, 163, 74, 0.9)" : "rgba(100, 116, 139, 0.9)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 20,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    {service.actif ? <Eye size={12} /> : <EyeOff size={12} />}
                    {service.actif ? "Visible" : "Masqué"}
                  </button>
                </div>
                <div style={{ position: "absolute", bottom: 10, left: 12, background: "rgba(15,23,42,0.85)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  {service.tarif || "Sur devis gratuit"}
                </div>
              </div>

              {/* Corps */}
              <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                    {service.nom}
                  </h3>
                  <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {service.description || "Aucune description renseignée."}
                  </p>

                  {/* Chef de chantier */}
                  {service.chefNom && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#1E293B", marginBottom: 10, background: "#F8FAFC", padding: "8px 12px", borderRadius: 10 }}>
                      <HardHat size={16} color="#EA580C" />
                      <span>{service.chefNom} {service.chefTelephone ? `(${service.chefTelephone})` : ""}</span>
                    </div>
                  )}

                  {/* Nombre de photos de chantiers réalisés */}
                  <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                    <Image size={14} />
                    <span>{Array.isArray(service.photosRealisation) ? service.photosRealisation.length : 0} photo(s) de réalisation(s)</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                  <button
                    onClick={() => openEditModal(service)}
                    style={{
                      flex: 1,
                      background: "#F1F5F9",
                      color: "#1E293B",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px 14px",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      cursor: "pointer"
                    }}
                  >
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.nom)}
                    style={{
                      background: "#FEE2E2",
                      color: "#DC2626",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px 14px",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      cursor: "pointer"
                    }}
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AJOUT / ÉDITION SERVICE */}
      {modalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(4px)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            width: "100%",
            maxWidth: 680,
            maxHeight: "92vh",
            overflowY: "auto",
            padding: "28px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "var(--ink)" }}>
                {editingService ? "Modifier le service BTP" : "Ajouter un nouveau service BTP"}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Nom & Ordre */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Nom du service *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maçonnerie & Gros Œuvre"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Ordre d'affichage</label>
                  <input
                    type="number"
                    value={form.ordre}
                    onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value, 10) || 0 })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
              </div>

              {/* Tarif & Type de Tarif */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Tarif affiché</label>
                  <input
                    type="text"
                    placeholder="Ex: Sur devis gratuit ou À partir de 15 000 KMF"
                    value={form.tarif}
                    onChange={(e) => setForm({ ...form, tarif: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Type de tarification</label>
                  <select
                    value={form.typeTarif}
                    onChange={(e) => setForm({ ...form, typeTarif: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, background: "#fff" }}
                  >
                    <option value="devis">Sur devis</option>
                    <option value="journee">À la journée</option>
                    <option value="m2">Au m²</option>
                    <option value="forfait">Au forfait</option>
                    <option value="prix_fixe">Prix fixe</option>
                  </select>
                </div>
              </div>

              {/* Photo Principale */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Photo principale (URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14 }}
                />
              </div>

              {/* Responsable & Contact WhatsApp */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Chef de chantier / Responsable</label>
                  <input
                    type="text"
                    placeholder="Ex: M. Bacar (Chef Maçon)"
                    value={form.chefNom}
                    onChange={(e) => setForm({ ...form, chefNom: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Téléphone WhatsApp direct</label>
                  <input
                    type="text"
                    placeholder="Ex: +269 333 00 00"
                    value={form.chefTelephone}
                    onChange={(e) => setForm({ ...form, chefTelephone: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14 }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Description complète de ce que propose l'entreprise</label>
                <textarea
                  rows={3}
                  placeholder="Détaillez les compétences, travaux inclus, matériel utilisé..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, resize: "vertical" }}
                />
              </div>

              {/* Conditions d'intervention */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Conditions de travail, zones & garanties</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Déplacement sur tout Ngazidja. Devis gratuit après visite. Garantie décennale."
                  value={form.conditions}
                  onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, resize: "vertical" }}
                />
              </div>

              {/* Galerie de Photos de Réalisations de ce Service */}
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
                  📸 Galerie des photos de réalisations (Chantiers réels de ce service)
                </label>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Coller l'URL d'une photo de chantier..."
                    value={newPhotoRealisation}
                    onChange={(e) => setNewPhotoRealisation(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 13 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoRealisation}
                    style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    + Ajouter
                  </button>
                </div>

                {form.photosRealisation.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
                    {form.photosRealisation.map((url, idx) => (
                      <div key={idx} style={{ position: "relative", height: 75, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
                        <img src={url} alt={`Réalisation ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => handleRemovePhotoRealisation(idx)}
                          style={{
                            position: "absolute", top: 4, right: 4,
                            width: 22, height: 22, borderRadius: "50%",
                            background: "rgba(220, 38, 38, 0.9)", border: "none", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statut actif */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  id="serviceActif"
                  checked={form.actif}
                  onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <label htmlFor="serviceActif" style={{ fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Afficher ce service sur le site public
                </label>
              </div>

              {/* Boutons validation */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 14, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: "#F1F5F9", color: "#1E293B", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "#16A34A",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 24px",
                    fontWeight: 800,
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
                  }}
                >
                  {submitting ? "Enregistrement..." : editingService ? "Mettre à jour" : "Créer le service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

