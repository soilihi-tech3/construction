import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Truck, CheckCircle2, X, AlertTriangle, RefreshCw, Search } from "lucide-react";
import api from "../../api";
import { toast } from "react-hot-toast";

export default function AdminLivraisons() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    region: "",
    sousRegions: "",
    prixKmf: "",
    delaiEstime: "24h à 48h",
    actif: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/livraisons");
      setRegions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Erreur chargement des régions de livraison");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      region: "",
      sousRegions: "",
      prixKmf: "",
      delaiEstime: "24h à 48h",
      actif: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      region: item.region,
      sousRegions: item.sousRegions || "",
      prixKmf: item.prixKmf,
      delaiEstime: item.delaiEstime || "24h à 48h",
      actif: Boolean(item.actif)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.region.trim()) {
      toast.error("Veuillez renseigner le nom de la région");
      return;
    }
    if (form.prixKmf === "" || isNaN(Number(form.prixKmf))) {
      toast.error("Veuillez indiquer un tarif de livraison valide");
      return;
    }

    try {
      setSubmitting(true);
      if (editingItem) {
        await api.put(`/admin/livraisons/${editingItem.id}`, form);
        toast.success("Région mise à jour avec succès");
      } else {
        await api.post("/admin/livraisons", form);
        toast.success("Région de livraison ajoutée");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer la région "${item.region}" ?`)) return;
    try {
      await api.delete(`/admin/livraisons/${item.id}`);
      toast.success("Région supprimée avec succès");
      loadData();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filtered = regions.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.region.toLowerCase().includes(q) ||
      (r.sousRegions && r.sousRegions.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={20} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", margin: 0 }}>
              Frais de Livraison par Régions (Ngazidja)
            </h1>
          </div>
          <p style={{ color: "var(--muted)", margin: "4px 0 0", fontSize: 14 }}>
            Définissez les zones desservies et leurs tarifs en KMF (le client choisit sa région lors de la commande).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            background: "#0F766E", color: "#fff", border: "none",
            padding: "12px 20px", borderRadius: 12, fontWeight: 800,
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)"
          }}
        >
          <Plus size={18} /> Ajouter une région
        </button>
      </div>

      {/* Barre de Recherche */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 420 }}>
        <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
        <input
          type="text"
          placeholder="Rechercher une région ou ville (Moroni, Mboudé, Itsandra...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bs-input"
          style={{ paddingLeft: 42, background: "#fff", borderRadius: 12 }}
        />
      </div>

      {/* Tableau / Liste */}
      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--muted)" }}>
          Chargement des tarifs de livraison...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: "#fff", borderRadius: 16, border: "1px solid var(--line)" }}>
          <MapPin size={40} color="#94A3B8" style={{ margin: "0 auto 12px" }} />
          <h3>Aucune région trouvée</h3>
          <p style={{ color: "var(--muted)" }}>Cliquez sur "Ajouter une région" pour configurer vos zones de livraison.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--line)", fontSize: 13, color: "var(--muted)", textTransform: "uppercase" }}>
                <th style={{ padding: "14px 20px" }}>Région / Zone</th>
                <th style={{ padding: "14px 20px" }}>Sous-régions & Villes couvertes</th>
                <th style={{ padding: "14px 20px" }}>Tarif Livraison</th>
                <th style={{ padding: "14px 20px" }}>Délai estimé</th>
                <th style={{ padding: "14px 20px" }}>Statut</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const prixNum = Number(item.prixKmf || 0);
                const eurNum = Math.round((prixNum / 491.96775) * 100) / 100;
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                    <td style={{ padding: "16px 20px", fontWeight: 800, color: "var(--ink)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={16} color="#EA580C" />
                        <span>{item.region}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--muted)", maxWidth: 360, fontSize: 13, lineHeight: 1.4 }}>
                      {item.sousRegions || "Toute la région"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 900, color: "#0F766E", fontSize: 15 }}>
                        {prixNum.toLocaleString("fr-FR")} KMF
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
                        soit {eurNum.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--muted)", fontSize: 13 }}>
                      {item.delaiEstime || "24h à 48h"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {item.actif ? (
                        <span style={{ background: "#DCFCE7", color: "#16A34A", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                          Actif
                        </span>
                      ) : (
                        <span style={{ background: "#F1F5F9", color: "#64748B", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                          Désactivé
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => openEditModal(item)}
                          style={{
                            background: "#F1F5F9", border: "none", color: "#334155",
                            padding: "6px 10px", borderRadius: 8, cursor: "pointer",
                            display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700
                          }}
                        >
                          <Edit2 size={14} /> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          style={{
                            background: "#FEF2F2", border: "none", color: "#DC2626",
                            padding: "6px 10px", borderRadius: 8, cursor: "pointer",
                            display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Création / Modification Région */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
              padding: 28, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "var(--ink)" }}>
                {editingItem ? "Modifier la région de livraison" : "Ajouter une région de livraison"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 }}>
                  Nom de la Région * (ex: Mboudé, Itsandra, Moroni...)
                </label>
                <input
                  type="text"
                  required
                  className="bs-input"
                  placeholder="ex: Mboudé (Nord-Ouest)"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 }}>
                  Villes & Sous-régions couvertes (séparées par des virgules)
                </label>
                <textarea
                  className="bs-input"
                  rows={3}
                  placeholder="ex: Ntsaweni, Chezani, Mandza, Nyumamilima..."
                  value={form.sousRegions}
                  onChange={(e) => setForm({ ...form, sousRegions: e.target.value })}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 }}>
                    Frais de livraison (KMF) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500"
                    className="bs-input"
                    placeholder="ex: 10000"
                    value={form.prixKmf}
                    onChange={(e) => setForm({ ...form, prixKmf: e.target.value })}
                  />
                  {form.prixKmf > 0 && (
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, fontWeight: 600 }}>
                      soit {(Math.round((Number(form.prixKmf) / 491.96775) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 }}>
                    Délai estimé
                  </label>
                  <input
                    type="text"
                    className="bs-input"
                    placeholder="ex: 24h à 48h"
                    value={form.delaiEstime}
                    onChange={(e) => setForm({ ...form, delaiEstime: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="region-actif"
                  checked={form.actif}
                  onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <label htmlFor="region-actif" style={{ fontSize: 14, fontWeight: 700, cursor: "pointer", color: "var(--ink)" }}>
                  Zone de livraison active (visible par les clients lors de la commande)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "10px 18px", borderRadius: 10, border: "1px solid var(--line)",
                    background: "#F8FAFC", color: "var(--muted)", fontWeight: 700, cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "10px 22px", borderRadius: 10, border: "none",
                    background: "#0F766E", color: "#fff", fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 8px rgba(15, 118, 110, 0.25)"
                  }}
                >
                  {submitting ? "Enregistrement..." : editingItem ? "Mettre à jour" : "Ajouter la région"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

