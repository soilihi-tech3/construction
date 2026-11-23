import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, AlertTriangle, Trash2 } from "lucide-react";
import Stars from "./Stars.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import { formatPrice as fcfa, getActiveCurrency, getProductPrice, formatDualPrice } from "../utils/currency.js";

export default function ProductCard({ product, isFavorisPage }) {
  const navigate = useNavigate();
  const { cart, addToCart, showToast } = useCart();
  const { user } = useAuth();
  
  const noteMoyenne = product.avis?.length
    ? product.avis.reduce((s, a) => s + a.note, 0) / product.avis.length
    : (product.noteEtoiles !== undefined && product.noteEtoiles !== null ? Number(product.noteEtoiles) : 5.0);

  const defaultImg = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80";
  const mainImage = product.imageUrl || defaultImg;
  const secondaryImage = product.imageUrl2 || null;

  // User-scoped favorites logic
  const [isFavorite, setIsFavorite] = useState(false);
  const getFavKey = () => (user && user.id ? `favorites_user_${user.id}` : "favorites_guest");

  useEffect(() => {
    const key = getFavKey();
    const favs = JSON.parse(localStorage.getItem(key) || "[]");
    setIsFavorite(favs.includes(product.id));
  }, [product.id, user?.id]);

  function toggleFavorite(e) {
    e.stopPropagation();
    const key = getFavKey();
    let favs = JSON.parse(localStorage.getItem(key) || "[]");
    if (isFavorite) {
      favs = favs.filter(id => id !== product.id);
      setIsFavorite(false);
      showToast(`"${product.nom}" retiré de vos favoris.`, "info", "Favoris");
    } else {
      favs.push(product.id);
      setIsFavorite(true);
      showToast(`"${product.nom}" ajouté à vos favoris !`, "success");
    }
    localStorage.setItem(key, JSON.stringify(favs));
    window.dispatchEvent(new Event("favorites_updated"));
  }

  const [activeCurrency, setActiveCurrencyState] = useState(() => getActiveCurrency());

  useEffect(() => {
    const handleCurr = (e) => setActiveCurrencyState(e.detail);
    window.addEventListener("currency_changed", handleCurr);
    return () => window.removeEventListener("currency_changed", handleCurr);
  }, []);

  // Détermination dynamique des prix selon la devise choisie
  const isSenegal = activeCurrency === "FCFA";
  const regularPrice = isSenegal && product.prixSenegal && Number(product.prixSenegal) > 0
    ? Number(product.prixSenegal)
    : Number(product.prix || 0);

  const promoPrice = isSenegal && product.prixPromoSenegal && Number(product.prixPromoSenegal) > 0
    ? Number(product.prixPromoSenegal)
    : (product.enPromo && product.prixPromo ? Number(product.prixPromo) : null);

  const hasPromo = Boolean(promoPrice && promoPrice < regularPrice);
  const promoPercent = hasPromo && promoPrice ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100) : 0;

  // Check stock out status (expiration retirée pour matériel électrique & outillage)
  const isOutOfStock = product.stock <= 0;

  // Cart quantity check
  const itemInCart = cart.find((l) => l.product.id === product.id);
  const qtyInCart = itemInCart ? itemInCart.quantite : 0;
  const isMaxStockReached = !isOutOfStock && qtyInCart >= product.stock;

  const weightUnitText = product.unite ? `/ ${product.unite}` : "";

  return (
    <div 
      className="bs-card" 
      onClick={() => navigate(`/produit/${product.id}`, { 
        state: { 
          product, 
          from: window.location.pathname + window.location.search 
        } 
      })} 
      style={{ opacity: isOutOfStock ? 0.75 : 1, position: "relative" }}
    >
      <div className="bs-thumb-container">
        <img 
          src={mainImage} 
          alt={product.nom} 
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImg;
          }}
          className={`bs-thumb-img ${secondaryImage ? "has-hover" : "zoom-hover"}`} 
        />
        {secondaryImage && (
          <img 
            src={secondaryImage} 
            alt={`${product.nom} 2`} 
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultImg;
            }}
            className="bs-thumb-img secondary zoom-hover" 
          />
        )}
        
        <button 
          className="bs-fav-btn" 
          onClick={toggleFavorite}
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          style={{
            position: "absolute", top: 12, right: 12, 
            background: isFavorite ? "#FDF2F0" : "rgba(255,255,255,0.9)", 
            border: isFavorite ? "1px solid #F8D7D2" : "none", 
            borderRadius: "50%", width: 34, height: 34, 
            display: "flex", alignItems: "center", justifyContent: "center", 
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10
          }}
        >
          <Heart size={18} color={isFavorite ? "#B4483A" : "var(--muted)"} fill={isFavorite ? "#B4483A" : "none"} />
        </button>

        {/* BADGE BTP PHOTO : POPULAIRE UNIQUEMENT (ÉPURATION TOTALE DU VISUEL) */}
        {(product.isPlusVendu || product.isPopulaire) && (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
            <span style={{
              background: "#F59E0B",
              color: "#000000",
              padding: "4px 12px",
              borderRadius: 20,
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.35)",
              display: "inline-block"
            }}>
              POPULAIRE
            </span>
          </div>
        )}

        {/* OUT OF STOCK OR MAX IN CART BADGES */}
        {isOutOfStock && product.disponibilite !== "sur_commande" ? (
          <span style={{
            position: "absolute", bottom: 12, left: 12,
            background: "#64748B", color: "#fff",
            padding: "4px 10px", borderRadius: 16,
            fontWeight: 800, fontSize: 11, zIndex: 10
          }}>
            Épuisé / Stock 0
          </span>
        ) : isMaxStockReached ? (
          <span style={{
            position: "absolute", bottom: 12, left: 12,
            background: "#D97706", color: "#fff",
            padding: "4px 10px", borderRadius: 16,
            fontWeight: 800, fontSize: 11, zIndex: 10,
            display: "flex", alignItems: "center", gap: 4
          }}>
            <AlertTriangle size={12} /> Stock max en panier ({qtyInCart}/{product.stock})
          </span>
        ) : product.stock <= product.seuilAlerte && product.stock > 0 ? (
          <span className="bs-stockflag">Stock limité ({product.stock})</span>
        ) : null}
      </div>

      <div className="bs-card-body" style={{ padding: "14px 16px 16px" }}>
        {/* CATÉGORIE EN ORANGE */}
        <div style={{
          color: "#EA580C",
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          marginBottom: 4
        }}>
          {product.Category?.nom || product.categorieNom || "MATÉRIAUX BTP"}
        </div>

        {/* TITRE DU PRODUIT */}
        <div className="nom" style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", lineHeight: 1.35, minHeight: 38 }}>
          {product.nom}
        </div>
        
        {/* Détail Volume / Spécification BTP si renseigné */}
        {product.volume && (
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2, marginBottom: 4 }}>
            Volume : <strong style={{ color: "var(--ink)" }}>{product.volume}</strong>
          </div>
        )}

        {/* AFFICHAGE DU PRIX : KMF EN HAUT / GRAND + PILL DISPONIBILITÉ À DROITE */}
        {(() => {
          const currentPrice = hasPromo && promoPrice ? promoPrice : regularPrice;
          const { kmfStr, eurStr } = formatDualPrice(currentPrice, product.prixParDevise?.EUR);
          const isSurCommande = product.disponibilite === "sur_commande";

          return (
            <div style={{ marginTop: 8 }}>
              {/* Ligne principale : Prix KMF + Badge Disponibilité */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span className="bs-price" style={{ fontSize: "17px", fontWeight: 900, color: hasPromo ? "#EA580C" : "#0F172A" }}>
                  {kmfStr}
                </span>

                {isSurCommande ? (
                  <span style={{
                    background: "#EFF6FF",
                    color: "#1D4ED8",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 12,
                    border: "1px solid #DBEAFE",
                    whiteSpace: "nowrap"
                  }}>
                    Sur commande
                  </span>
                ) : (
                  <span style={{
                    background: "#DCFCE7",
                    color: "#16A34A",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 12,
                    border: "1px solid #BBF7D0",
                    whiteSpace: "nowrap"
                  }}>
                    En stock
                  </span>
                )}
              </div>

              {/* Ligne secondaire : Prix en Euro + unité de vente */}
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600, marginTop: 2 }}>
                {eurStr}{product.unite ? ` · par ${product.unite}` : ""}
              </div>
            </div>
          );
        })()}

        {/* BOUTON AJOUTER MODERNE NOIR CONFORME AUX MAQUETTES */}
        <div style={{ marginTop: 12 }}>
          <button 
            className="bs-add-btn" 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isOutOfStock && product.disponibilite !== "sur_commande") {
                showToast(`Désolé, le produit "${product.nom}" est actuellement en rupture de stock.`, "warning");
                return;
              }
              addToCart(product, 1); 
            }}
            style={{
              width: "100%",
              marginTop: 0,
              background: isOutOfStock && product.disponibilite !== "sur_commande" 
                ? "var(--line)" 
                : isMaxStockReached 
                ? "#FEF3C7" 
                : "#0F172A",
              color: isOutOfStock && product.disponibilite !== "sur_commande" 
                ? "var(--muted)" 
                : isMaxStockReached 
                ? "#B45309" 
                : "#ffffff",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 700,
              fontSize: "13.5px",
              border: isMaxStockReached ? "1px solid #F59E0B" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (!isOutOfStock && !isMaxStockReached) e.currentTarget.style.background = "#1E293B";
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock && !isMaxStockReached) e.currentTarget.style.background = "#0F172A";
            }}
          >
            {isOutOfStock && product.disponibilite !== "sur_commande" 
              ? "Épuisé" 
              : isMaxStockReached 
              ? `Stock max (${qtyInCart}/${product.stock})` 
              : "+ Ajouter"}
          </button>

          {isFavorisPage && (
            <button
              onClick={toggleFavorite}
              title="Supprimer ce favori"
              style={{
                marginTop: 0,
                background: "#FDF2F0",
                color: "#B4483A",
                border: "1px solid #F8D7D2",
                borderRadius: "var(--radius-sm)",
                padding: "0 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8D7D2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FDF2F0")}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

