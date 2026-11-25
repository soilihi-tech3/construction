import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Star, CheckCircle, MessageCircle, X, ZoomIn, Truck, ShieldCheck, Sparkles, Leaf, Zap, Lock, Headphones, Box, Layers, Grid, Wrench, Hammer, Paintbrush, HardHat, Phone, ExternalLink, Calendar, MapPin, Check } from "lucide-react";
import api, { SLUG } from "../../api";
import ProductCard from "../../components/ProductCard.jsx";
import { subscribeRealtime } from "../../utils/realtime.js";
import { useData } from "../../context/DataContext.jsx";

const DEFAULT_SLIDES = [
  {
    id: 1,
    tag: "🏗️ GROS ŒUVRE & MATÉRIAUX BTP",
    titleLine1: "Matériaux de Construction",
    titleLine2: "Certifiés Haute Qualité",
    subtitle: "Ciment Portland, fer à béton HA de 8 à 16, sable, gravier concassé en voyage complet et outillage professionnel livrés directement sur votre chantier aux Comores.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=1200&q=80",
    buttonText: "COMMANDER DES MATÉRIAUX",
    linkUrl: "/catalogue",
    editorial: "Gros Œuvre & Fondations",
    objectPosition: "center center"
  },
  {
    id: 2,
    tag: "🚚 LIVRAISON PAR CAMION BENNE",
    titleLine1: "Sable & Gravier Concasse",
    titleLine2: "Livré sur Chantier",
    subtitle: "Livraison par voyage complet de 8 m³ pour fondations et dalles sur tout Ngazidja (Moroni, Mboude, Bambao, Itsandra...). Frais de transport inclus.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    buttonText: "VOIR LE SABLE & GRAVIER",
    linkUrl: "/catalogue?famille=Sable",
    editorial: "Agrégats & Béton",
    objectPosition: "center center"
  },
  {
    id: 3,
    tag: "👷 NOS SERVICES BTP & ARTISANS",
    titleLine1: "Maçonnerie, Électricité",
    titleLine2: "& Finition Soignée",
    subtitle: "Des équipes d'artisans maçons, plombiers, électriciens et peintres qualifiés pour bâtir et rénover vos projets dans le respect des normes et des délais.",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
    buttonText: "DÉCOUVRIR NOS SERVICES",
    linkUrl: "/services",
    editorial: "Prestations BTP",
    objectPosition: "center center"
  }
];

const DEFAULT_BTP_CATEGORIES = [
  { id: 8, nom: "Ciment & Liants", description: "Ciment Portland 42.5R, chaux, colles carrelage et mortiers prêts à l'emploi", iconType: "box", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80" },
  { id: 9, nom: "Fer à béton & Métallerie", description: "Barres fer torsadé HA Ø 8 à 16, treillis soudés, fils de fer et étriers", iconType: "grid", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" },
  { id: 10, nom: "Sable & Gravier", description: "Sable noir concassé de carrière et gravier pour béton par camion complet 8 m³", iconType: "truck", imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80" },
  { id: 11, nom: "Bois & Planches", description: "Planches de coffrage, chevrons, madriers et bastaings bois rouge traité", iconType: "layers", imageUrl: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80" },
  { id: 12, nom: "Contreplaqué & Panneaux", description: "Contreplaqué marine hydrofuge, MDF et panneaux de coffrage bakélisés", iconType: "layers", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
  { id: 13, nom: "Quincaillerie", description: "Clous acier, vis à bois, boulons charpente, chevilles et charnières", iconType: "wrench", imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80" },
  { id: 14, nom: "Outillage", description: "Brouettes renforcées, pelles de chantier, pioches, truelles et niveaux", iconType: "hammer", imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80" },
  { id: 15, nom: "Peinture & Finition", description: "Peintures extérieures anti-humidité, enduits de lissage, rouleaux et pinceaux", iconType: "paintbrush", imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80" }
];

function getCategoryImageUrl(nom, currentImg) {
  if (currentImg && currentImg.trim()) return currentImg;
  const n = (nom || "").toLowerCase();
  if (n.includes("ciment") || n.includes("liant")) return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80";
  if (n.includes("fer") || n.includes("métal")) return "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80";
  if (n.includes("sable") || n.includes("gravier")) return "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80";
  if (n.includes("bois") || n.includes("planche")) return "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80";
  if (n.includes("contreplaqué") || n.includes("panneau")) return "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80";
  if (n.includes("quincaillerie")) return "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80";
  if (n.includes("outil")) return "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80";
  if (n.includes("peint")) return "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80";
  return "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=800&q=80";
}

function getCategoryIconComponent(nom, iconType) {
  const n = (nom || "").toLowerCase();
  if (n.includes("ciment") || n.includes("liant") || iconType === "box") return Box;
  if (n.includes("fer") || n.includes("métal") || iconType === "grid") return Grid;
  if (n.includes("bois") || n.includes("planche") || n.includes("panneau") || iconType === "layers") return Layers;
  if (n.includes("sable") || n.includes("gravier") || iconType === "truck") return Truck;
  if (n.includes("outil") || iconType === "hammer") return Hammer;
  if (n.includes("quincaillerie") || iconType === "wrench") return Wrench;
  if (n.includes("peint") || iconType === "paintbrush") return Paintbrush;
  if (n.includes("plomb") || n.includes("electr")) return Zap;
  return HardHat;
}

function getCategoryDesc(nom, customDesc) {
  if (customDesc && customDesc.trim()) return customDesc;
  const n = (nom || "").toLowerCase();
  if (n.includes("ciment")) return "Ciment Portland, chaux, colles et mortiers";
  if (n.includes("fer")) return "Barres HA, treillis soudés, fils de fer";
  if (n.includes("bois")) return "Planches, chevrons, madriers";
  if (n.includes("contreplaqué") || n.includes("panneau")) return "Contreplaqué marine, MDF, panneaux de coffrage";
  if (n.includes("sable") || n.includes("gravier")) return "Sable concassé, gravier 8m³, ballast pour béton";
  if (n.includes("outil")) return "Brouettes, pelles, pioches, truelles";
  if (n.includes("quincaillerie")) return "Clous, vis, boulons, charnières";
  if (n.includes("peint")) return "Peintures, enduits, pinceaux, rouleaux";
  if (n.includes("plomb") || n.includes("electr")) return "Tuyaux PVC, raccords, câbles, disjoncteurs";
  return "Matériaux certifiés pour vos chantiers";
}


const parseSlides = (bannerSlides, boutiqueNom = "") => {
  if (!bannerSlides) return DEFAULT_SLIDES;
  let parsed = bannerSlides;
  if (typeof bannerSlides === "string") {
    try {
      parsed = JSON.parse(bannerSlides);
    } catch (e) {
      return DEFAULT_SLIDES;
    }
  }
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map((s, idx) => {
      const fallback = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];
      const img = s.imageUrl || fallback.imageUrl;

      const rawTitle = (s.title || s.nom || s.titre || "").trim();
      let l1 = s.titleLine1 ? String(s.titleLine1).trim() : "";
      let l2 = s.titleLine2 ? String(s.titleLine2).trim() : "";

      if (!l1 && !l2 && rawTitle) {
        if (rawTitle.includes("\n")) {
          const lines = rawTitle.split("\n");
          l1 = lines[0].trim();
          l2 = lines.slice(1).join(" ").trim();
        } else if (rawTitle.includes("&")) {
          const parts = rawTitle.split("&");
          l1 = parts[0].trim();
          l2 = "& " + parts.slice(1).join("&").trim();
        } else if (rawTitle.includes(" - ")) {
          const parts = rawTitle.split(" - ");
          l1 = parts[0].trim();
          l2 = parts.slice(1).join(" - ").trim();
        } else if (rawTitle.includes(". ")) {
          const parts = rawTitle.split(". ");
          l1 = parts[0].trim() + ".";
          l2 = parts.slice(1).join(". ").trim();
        } else {
          const words = rawTitle.split(" ");
          if (words.length >= 3) {
            const mid = Math.ceil(words.length / 2);
            l1 = words.slice(0, mid).join(" ");
            l2 = words.slice(mid).join(" ");
          } else if (words.length === 2) {
            l1 = words[0];
            l2 = words[1];
          } else {
            l1 = rawTitle;
            l2 = "";
          }
        }
      }

      const defaultTag = boutiqueNom ? `${boutiqueNom.toUpperCase()} • SÉLECTION OFFICIELLE` : "NOUVELLE SÉLECTION";

      return {
        id: s.id || idx + 1,
        tag: (s.tag && s.tag.trim()) ? s.tag.trim() : (s.surtitre && s.surtitre.trim() ? s.surtitre.trim() : defaultTag),
        titleLine1: l1 || rawTitle || (boutiqueNom ? `Bienvenue chez ${boutiqueNom}` : fallback.titleLine1),
        titleLine2: l2 !== undefined && l2 !== null ? l2 : (s.title ? "" : fallback.titleLine2),
        subtitle: (s.subtitle !== undefined && s.subtitle !== null && String(s.subtitle).trim() !== "")
          ? String(s.subtitle).trim()
          : (s.title ? "Découvrez notre sélection exclusive et profitez des meilleurs prix garantis." : fallback.subtitle),
        buttonText: (s.buttonText && s.buttonText.trim()) ? s.buttonText.trim() : (s.title ? "DÉCOUVRIR LA COLLECTION" : fallback.buttonText),
        imageUrl: img,
        categoryId: s.categoryId || "",
        linkUrl: s.linkUrl || (s.categoryId ? `/catalogue?categoryId=${s.categoryId}` : "/catalogue"),
        editorial: s.editorial || boutiqueNom || fallback.editorial,
        objectPosition: s.objectPosition || "center center"
      };
    });
  }
  return DEFAULT_SLIDES;
};

const parseBanners = (banners) => {
  if (!banners) return [];
  let parsed = banners;
  if (typeof banners === "string") {
    try {
      parsed = JSON.parse(banners);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(parsed) ? parsed : [];
};

function CategoryScrollSection({ category, products, onNavigate, badgeColor = "var(--forest-dark)" }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div style={{ marginTop: 40, marginBottom: 40 }}>
      {/* SECTION HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: badgeColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {category.nom}
          </h2>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 13 }}>
            Découvrez notre sélection spéciale : {category.nom}.
          </p>
        </div>

        <button
          onClick={() => onNavigate()}
          style={{
            background: "none", border: "1px solid var(--line)", borderRadius: 20,
            padding: "8px 18px", fontSize: 13, fontWeight: 700, color: badgeColor,
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            transition: "all 0.15s", whiteSpace: "nowrap"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--forest-light)"; e.currentTarget.style.borderColor = "var(--forest)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--line)"; }}
        >
          Voir tout <ArrowRight size={15} />
        </button>
      </div>

      {/* SCROLL CONTAINER WITH ARROW CONTROLS */}
      <div style={{ position: "relative" }}>
        <button
          className="bs-scroll-arrow left"
          onClick={() => scroll("left")}
          style={{
            position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid var(--line)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <ChevronLeft size={20} color={badgeColor} />
        </button>

        <div
          ref={scrollRef}
          style={{
            display: "flex", gap: 16, overflowX: "auto", scrollbarWidth: "none",
            msOverflowStyle: "none", padding: "8px 4px 16px 4px", scrollBehavior: "smooth"
          }}
        >
          {products.map((p) => (
            <div key={p.id} className="bs-scroll-item">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <button
          className="bs-scroll-arrow right"
          onClick={() => scroll("right")}
          style={{
            position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid var(--line)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <ChevronRight size={20} color={badgeColor} />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { getData, setData, isStale, invalidate } = useData();

  const [categories, setCategories] = useState(() => {
    const cached = getData(`categories:${SLUG}`);
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const ls = localStorage.getItem(`cached_categories_${SLUG}`);
      return ls ? JSON.parse(ls) : [];
    } catch (e) { return []; }
  });

  const [familles, setFamilles] = useState(() => {
    const cached = getData(`familles:${SLUG}`);
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const ls = localStorage.getItem(`cached_familles_${SLUG}`);
      return ls ? JSON.parse(ls) : [];
    } catch (e) { return []; }
  });

  const [products, setProducts] = useState(() => {
    const cached = getData(`products:${SLUG}:::`);
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const ls = localStorage.getItem(`cached_products_${SLUG}`);
      return ls ? JSON.parse(ls) : [];
    } catch (e) { return []; }
  });

  const [testimonials, setTestimonials] = useState([]);
  const [avisGenre, setAvisGenre] = useState("tous"); // 'tous' | 'femme' | 'homme'
  const [activeModalTestimonial, setActiveModalTestimonial] = useState(null);
  const [services, setServices] = useState([]);
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  const [boutique, setBoutique] = useState(() => {
    try {
      const cached = localStorage.getItem(`cached_boutique_${SLUG}`);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  function loadData(force = false) {
    api.get(`/store/${SLUG}`).then((res) => {
      if (res.data) {
        setBoutique(res.data);
        try {
          localStorage.setItem(`cached_boutique_${SLUG}`, JSON.stringify(res.data));
        } catch (e) {}
      }
    }).catch(() => {});

    api.get(`/store/${SLUG}/testimonials`).then((res) => {
      if (Array.isArray(res.data)) {
        setTestimonials(res.data);
      }
    }).catch(() => {});

    api.get(`/store/${SLUG}/services`).then((res) => {
      if (Array.isArray(res.data)) {
        setServices(res.data);
      }
    }).catch(() => {});

    if (!force && !isStale(`categories:${SLUG}`) && categories.length > 0 && products.length > 0) {
      return;
    }

    api.get(`/store/${SLUG}/categories`).then((res) => {
      if (Array.isArray(res.data)) {
        setData(`categories:${SLUG}`, res.data, 300000);
        setCategories(res.data);
        try { localStorage.setItem(`cached_categories_${SLUG}`, JSON.stringify(res.data)); } catch (e) {}
      }
    }).catch(() => {});

    api.get(`/store/${SLUG}/familles`).then((res) => {
      if (Array.isArray(res.data)) {
        setData(`familles:${SLUG}`, res.data, 600000);
        setFamilles(res.data);
        try { localStorage.setItem(`cached_familles_${SLUG}`, JSON.stringify(res.data)); } catch (e) {}
      }
    }).catch(() => {});

    api.get(`/store/${SLUG}/products`).then((res) => {
      if (Array.isArray(res.data)) {
        setData(`products:${SLUG}:::`, res.data, 120000);
        setProducts(res.data);
        try { localStorage.setItem(`cached_products_${SLUG}`, JSON.stringify(res.data)); } catch (e) {}
      }
    }).catch(() => {});
  }

  useEffect(() => {
    loadData(false);
    const unsub = subscribeRealtime((detail) => {
      if (
        detail.type === "product_updated" ||
        detail.type === "product_created" ||
        detail.type === "product_deleted" ||
        detail.type === "category_updated" ||
        detail.type === "boutique_updated"
      ) {
        invalidate("products");
        invalidate("categories");
        loadData(true);
      }
    });
    return unsub;
  }, []);

  const slides = parseSlides(boutique?.bannerSlides, boutique?.nom);
  const sideBanners = parseBanners(boutique?.sideBanners);

  useEffect(() => {
    const total = slides.length;
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const safeProducts = Array.isArray(products) ? products : [];
  const btpProducts = safeProducts.filter(p => {
    const n = (p.nom || "").toLowerCase();
    return !n.includes("chargeur") && !n.includes("glace") && !n.includes("coque") && 
           !n.includes("iphone") && !n.includes("samsung") && !n.includes("écouteur") && 
           !n.includes("airpod") && !n.includes("powerbank");
  });

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeFamilles = Array.isArray(familles) && familles.length > 0
    ? familles
    : [
        { id: 1, nom: "Gros Œuvre & Fondations" },
        { id: 2, nom: "Menuiserie & Coffrage" },
        { id: 3, nom: "Outillage & Quincaillerie" },
        { id: 4, nom: "Peinture & Finition" }
      ];

  function getNormalizedFamilleName(str) {
    if (!str) return "";
    let s = String(str).trim();
    if (s.toLowerCase().startsWith("section ")) {
      s = s.slice(8).trim();
    } else if (s.toLowerCase() === "section") {
      s = "";
    }
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const familleMap = new Map();
  safeFamilles.forEach(f => {
    const norm = getNormalizedFamilleName(f.nom);
    if (norm && !familleMap.has(norm.toLowerCase())) {
      familleMap.set(norm.toLowerCase(), norm);
    }
  });

  safeProducts.forEach(p => {
    const raw = p.Category?.famille || p.famille;
    const norm = getNormalizedFamilleName(raw);
    if (norm && !familleMap.has(norm.toLowerCase())) {
      familleMap.set(norm.toLowerCase(), norm);
    }
  });

  const uniqueFamilles = Array.from(familleMap.values());
  const promos = safeProducts.filter((p) => p && (p.enPromo || p.prixPromo));

  // Témoignages clients vérifiés
  const filteredTestimonials = testimonials || [];

  // Pour défilement continu infini sans accroc, dupliquer la liste si >= 2 éléments
  const displayTestimonials = filteredTestimonials.length > 0 
    ? [...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials] 
    : [];

  function handleBannerClick(banner) {
    if (banner.categoryId) {
      navigate(`/catalogue?categoryId=${banner.categoryId}`);
    } else if (banner.linkUrl) {
      navigate(banner.linkUrl);
    } else {
      navigate("/catalogue");
    }
  }

  // Système de texte et slides dynamiques configurés par l'admin
  const currentSlideDisplay = (() => {
    const slide = slides[activeSlide] || slides[0] || {};
    return {
      tag: slide.tag,
      titleLine1: slide.titleLine1 || slide.title || (boutique?.nom ? `Bienvenue chez ${boutique.nom}` : "Nouvelle Collection"),
      titleLine2: slide.titleLine2 || "",
      subtitle: slide.subtitle,
      buttonText: slide.buttonText || "DÉCOUVRIR LA COLLECTION",
      imageUrl: slide.imageUrl,
      linkUrl: slide.linkUrl,
      editorial: slide.editorial
    };
  })();

  return (
    <>
      {/* 1. HERO BANNER - TECHHAVEN STYLE */}
      <div className="bs-hero-wrapper">
        <div className="bs-hero-banner">
          {/* Colonne Gauche (44%) : Titre, Tagline & Bouton CTA */}
          <div className="bs-hero-text-col">
            <div key={activeSlide} className="bs-hero-text-animated">
              {currentSlideDisplay.tag && (
                <div className="bs-hero-collection-tag">
                  <span className="bs-hero-tag-dot"></span>
                  {currentSlideDisplay.tag}
                </div>
              )}

              <h1 className="bs-hero-title">
                <span className="bs-hero-title-dark">{currentSlideDisplay.titleLine1}</span>
                {currentSlideDisplay.titleLine2 ? (
                  <span className="bs-hero-title-blue"> {currentSlideDisplay.titleLine2}</span>
                ) : null}
              </h1>

              {currentSlideDisplay.subtitle && (
                <p className="bs-hero-subtitle">
                  {currentSlideDisplay.subtitle}
                </p>
              )}

              <div className="bs-hero-cta-wrap">
                <button 
                  className="bs-hero-cta-btn" 
                  onClick={() => handleBannerClick(slides[activeSlide] || {})}
                >
                  <span>{currentSlideDisplay.buttonText}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Colonne Droite (56%) : Défilement fluide des photos d'appareils */}
          <div className="bs-hero-slider-window">
            <div 
              className="bs-hero-slider-track"
              style={{
                display: "flex",
                width: `${slides.length * 100}%`,
                height: "100%",
                transform: `translateX(-${(activeSlide * 100) / slides.length}%)`,
                transition: "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)"
              }}
            >
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id || idx} 
                  className="bs-hero-slide-img-wrap"
                  style={{
                    width: `${100 / slides.length}%`,
                    height: "100%"
                  }}
                  onClick={() => handleBannerClick(slide)}
                >
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title || "Appareils Tech"} 
                    className="bs-hero-slide-img"
                    onError={(e) => {
                      e.currentTarget.src = "/images/tech_hero_gadgets.jpg";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Boutons flèches de navigation circulaires */}
            {slides.length > 1 && (
              <>
                <button 
                  className="bs-hero-nav-btn prev" 
                  onClick={(e) => { e.stopPropagation(); setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length); }}
                  aria-label="Diapositive précédente"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  className="bs-hero-nav-btn next" 
                  onClick={(e) => { e.stopPropagation(); setActiveSlide((prev) => (prev + 1) % slides.length); }}
                  aria-label="Diapositive suivante"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Points indicateurs de défilement */}
                <div className="bs-hero-dots">
                  {slides.map((_, idx) => (
                    <button 
                      key={idx} 
                      className={`bs-hero-dot ${idx === activeSlide ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                      aria-label={`Aller au slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4 Badges de Confiance sous le Hero Banner (Fidèle à la maquette) */}
        <div className="bs-hero-trust-bar">
          <div className="bs-hero-trust-badge">
            <div className="bs-hero-trust-icon-box">
              <Truck size={20} />
            </div>
            <div className="bs-hero-trust-texts">
              <span className="bs-hero-trust-title">FREE SHIPPING</span>
              <span className="bs-hero-trust-desc">Dès 25 000 KMF d'achat</span>
            </div>
          </div>

          <div className="bs-hero-trust-divider"></div>

          <div className="bs-hero-trust-badge">
            <div className="bs-hero-trust-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div className="bs-hero-trust-texts">
              <span className="bs-hero-trust-title">PREMIUM QUALITY</span>
              <span className="bs-hero-trust-desc">100% Produits d'origine</span>
            </div>
          </div>

          <div className="bs-hero-trust-divider"></div>

          <div className="bs-hero-trust-badge">
            <div className="bs-hero-trust-icon-box">
              <Lock size={20} />
            </div>
            <div className="bs-hero-trust-texts">
              <span className="bs-hero-trust-title">SECURE PAYMENT</span>
              <span className="bs-hero-trust-desc">Paiement fiable & crypté</span>
            </div>
          </div>

          <div className="bs-hero-trust-divider"></div>

          <div className="bs-hero-trust-badge">
            <div className="bs-hero-trust-icon-box">
              <Headphones size={20} />
            </div>
            <div className="bs-hero-trust-texts">
              <span className="bs-hero-trust-title">24/7 SUPPORT</span>
              <span className="bs-hero-trust-desc">Assistance réactive 7j/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATÉGORIES EN HAUT : BENTO GRID v2 STRICTEMENT 6 CARTES IMMERSIVES PLEINE IMAGE */}
      {(() => {
        const btpCats = safeCategories.filter(c => {
          const n = (c.nom || "").toLowerCase();
          return !n.includes("chargeur") && !n.includes("glace") && !n.includes("coque") && 
                 !n.includes("écouteur") && !n.includes("câble") && !n.includes("powerbank") && 
                 !n.includes("support");
        });
        const baseList = btpCats.length >= 6 
          ? btpCats 
          : [...btpCats, ...DEFAULT_BTP_CATEGORIES.filter(d => !btpCats.some(b => b.nom.toLowerCase().includes(d.nom.toLowerCase().slice(0, 5))))];
        const displayCategories = baseList.slice(0, 6);

        // Compter les produits par catégorie
        const catCounts = {};
        if (products && Array.isArray(products)) {
          products.forEach(p => {
            const cid = p.categoryId || (p.categorie && p.categorie.id);
            if (cid) catCounts[cid] = (catCounts[cid] || 0) + 1;
          });
        }
        const fallbackCounts = [24, 32, 8, 18, 14, 56];

        return (
          <section className="cats" id="categories" style={{ marginTop: 20, marginBottom: 44, padding: "24px 0" }}>
            <div className="cats__inner">
              <header className="cats__head">
                <div>
                  <span className="cats__eyebrow">Catalogue</span>
                  <h2 className="cats__title">Nos catégories de produits</h2>
                  <p className="cats__sub">Tout le nécessaire pour vos chantiers, du gros œuvre à la finition.</p>
                </div>
                <button 
                  onClick={() => navigate("/catalogue")}
                  className="cats__all"
                  aria-label="Voir tout le catalogue"
                >
                  <span>Voir tout le catalogue</span>
                  <ArrowRight size={16} />
                </button>
              </header>

              <div className="cats__grid">
                {displayCategories.map((c, idx) => {
                  const IconComp = getCategoryIconComponent(c.nom, c.iconType);
                  const categoryImg = getCategoryImageUrl(c.nom, c.imageUrl);
                  const isWide = idx === 0 || idx === 5;
                  const count = catCounts[c.id] || fallbackCounts[idx] || 12;

                  return (
                    <div
                      key={c.id || idx}
                      onClick={() => navigate(`/catalogue?categoryId=${c.id}`)}
                      className={`cat-bento-card ${isWide ? "cat--wide" : ""}`}
                    >
                      {/* Image plein cadre */}
                      <img 
                        src={categoryImg}
                        alt={c.nom}
                        className="cat__img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=800&q=80";
                        }}
                      />

                      {/* Top bar avec icône verre et pill de count */}
                      <div className="cat__top">
                        <div className="cat__icon">
                          <IconComp size={22} strokeWidth={2} />
                        </div>
                        <span className="cat__count">
                          {count} produit{count > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Contenu titre et description */}
                      <div className="cat__content">
                        <h3 className="cat__title">
                          {c.nom}
                        </h3>
                        <p className="cat__desc">
                          {getCategoryDesc(c.nom, c.description)}
                        </p>
                      </div>

                      {/* Flèche ronde interactive */}
                      <div className="cat__arrow" title={`Voir ${c.nom}`}>
                        <ArrowRight size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 3. NOS SERVICES BTP : 4 GRANDES CARTES IMMERSIVES (Fidèle à la maquette Comores Houla) */}
      {(() => {
        const defaultBtpServices = [
          {
            id: 1,
            nom: "Maçonnerie & Gros Œuvre",
            description: "Fondations, élévation de murs en parpaings, chaînages, dalles béton armé et coffrage professionnel pour villas aux Comores.",
            tarif: "Sur devis gratuit",
            conditions: "Intervention sur tout Ngazidja. Matériel et main d'œuvre qualifiée.",
            chefNom: "Chef Maçon M. Bacar",
            chefTelephone: boutique?.whatsappNumber || boutique?.telephone || "+269 333 00 00",
            imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f7?auto=format&fit=crop&w=800&q=80",
            photosRealisation: [
              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80"
            ]
          },
          {
            id: 2,
            nom: "Électricité Bâtiment",
            description: "Installation électrique complète conforme aux normes de sécurité : tableaux de distribution, câblage, disjoncteurs et éclairage.",
            tarif: "Sur devis gratuit",
            conditions: "Intervention rapide et matériel certifié.",
            chefNom: "M. Ahmed (Électricien)",
            chefTelephone: boutique?.whatsappNumber || boutique?.telephone || "+269 333 00 00",
            imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
            photosRealisation: [
              "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
            ]
          },
          {
            id: 3,
            nom: "Peinture",
            description: "Peinture intérieure et extérieure, préparation des supports, enduits de lissage et revêtements anti-humidité tropicale.",
            tarif: "Sur devis gratuit",
            conditions: "Nettoyage de fin de chantier inclus.",
            chefNom: "Responsable Peinture M. Soilihi",
            chefTelephone: boutique?.whatsappNumber || boutique?.telephone || "+269 342 08 08",
            imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
            photosRealisation: [
              "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80"
            ]
          },
          {
            id: 4,
            nom: "Carrelage",
            description: "Pose professionnelle de carrelage au sol, faïence murale de salles de bains et terrasses avec joints hydrofuges.",
            tarif: "Sur devis gratuit",
            conditions: "Ragréage et calepinage précis réalisés avant pose.",
            chefNom: "Youssouf Bacar (Carreleur)",
            chefTelephone: boutique?.whatsappNumber || boutique?.telephone || "+269 342 08 08",
            imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
            photosRealisation: [
              "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
            ]
          },
          {
            id: 5,
            nom: "Plomberie",
            description: "Réseaux d'eau potable, évacuations PVC, fosses septiques ventilées, sanitaires, surpresseurs et citernes.",
            tarif: "Sur devis gratuit",
            conditions: "Tests d'étanchéité et mise en eau systématiques.",
            chefNom: "Chef Plombier M. Nassor",
            chefTelephone: boutique?.whatsappNumber || boutique?.telephone || "+269 342 08 08",
            imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
            photosRealisation: [
              "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80"
            ]
          },
          {
            id: 6,
            nom: "Architecture",
            description: "Conception de plans 2D/3D, métrés précis, estimation quantitative et supervision technique des fondations à la toiture.",
            tarif: "Sur devis gratuit",
            conditions: "Rendez-vous sur chantier ou échange à distance pour la diaspora.",
            chefNom: "Ing. Nassim Abdallah",
            chefTelephone: boutique?.whatsappNumber || boutique?.telephone || "+269 342 08 08",
            imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
            photosRealisation: [
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
            ]
          }
        ];

        const displayServices = services && services.length > 0 ? services : defaultBtpServices;

        return (
          <div style={{ marginTop: 50, marginBottom: 50 }}>
            {/* EN-TÊTE CENTRÉ COMME SUR COMORESHOULA.COM */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <h2 style={{
                color: "#DC2626",
                fontSize: "clamp(26px, 4vw, 34px)",
                fontWeight: 900,
                margin: "0 0 10px",
                letterSpacing: "-0.5px"
              }}>
                Nos Services
              </h2>
              <div style={{
                fontSize: "clamp(16px, 2.5vw, 20px)",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: 10
              }}>
                Réalisez vos travaux avec notre équipe d'experts BTP aux Comores !
              </div>
              <p style={{
                maxWidth: 820,
                margin: "0 auto",
                color: "#64748B",
                fontSize: 15,
                lineHeight: 1.6
              }}>
                Nous vous accompagnons dans tous vos projets de construction : maçonnerie, électricité, peinture, carrelage et plomberie. Nous garantissons un travail soigné et de qualité.
              </p>
              <div style={{ marginTop: 12 }}>
                <button 
                  onClick={() => navigate("/services")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EA580C",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Voir tous les détails & tarifs →
                </button>
              </div>
            </div>

            {/* GRILLE 2 COLONNES PANORAMIQUE FIDÈLE À LA MAQUETTE */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 20
            }}>
              {displayServices.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveServiceModal(s)}
                  style={{
                    position: "relative",
                    height: 220,
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.18)";
                    const img = e.currentTarget.querySelector(".srv-bg-img");
                    if (img) img.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";
                    const img = e.currentTarget.querySelector(".srv-bg-img");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={s.imageUrl}
                    alt={s.nom}
                    className="srv-bg-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.42)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    transition: "background 0.3s ease"
                  }}>
                    <h3 style={{
                      color: "#ffffff",
                      fontSize: "clamp(24px, 3.2vw, 30px)",
                      fontWeight: 800,
                      margin: 0,
                      textAlign: "center",
                      letterSpacing: "-0.4px",
                      textShadow: "0 2px 10px rgba(0,0,0,0.7)"
                    }}>
                      {s.nom}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 4. PRODUITS LES PLUS VENDUS & POPULAIRES (SUR 4 COLONNES DESKTOP) */}
      {(() => {
        const plusVendus = btpProducts.filter(p => p.isPlusVendu || (p.ventesCount && p.ventesCount > 0));
        const toShow = plusVendus.length > 0 ? plusVendus.slice(0, 8) : btpProducts.slice(0, 4);

        if (toShow.length === 0) return null;

        return (
          <div style={{ marginTop: 36, marginBottom: 36 }}>
            <div className="bs-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 800, color: "var(--ink, #0F172A)" }}>🔥 Produits Populaires & Plus Vendus</h2>
              <button onClick={() => navigate("/catalogue")} style={{ background: "none", border: "none", color: "#EA580C", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                Voir tout le catalogue →
              </button>
            </div>
            <div className="bs-grid-home">
              {toShow.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        );
      })()}

      {/* 5. MATÉRIAUX RECOMMANDÉS PAR NOS EXPERTS (SUR 4 COLONNES DESKTOP) */}
      {(() => {
        const recommandes = btpProducts.filter(p => p.isRecommande);
        const toShow = recommandes.length > 0 ? recommandes.slice(0, 8) : btpProducts.slice(4, 8);

        if (toShow.length === 0) return null;

        return (
          <div style={{ marginTop: 36, marginBottom: 36 }}>
            <div className="bs-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 800, color: "var(--ink, #0F172A)" }}>⭐ Recommandés pour vos Chantiers</h2>
              <button onClick={() => navigate("/catalogue")} style={{ background: "none", border: "none", color: "#EA580C", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                Voir tout →
              </button>
            </div>
            <div className="bs-grid-home">
              {toShow.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        );
      })()}

      {/* 6. NOUVEAUX ARRIVAGES MATÉRIAUX */}
      {btpProducts.length > 0 && (() => {
        const customNouveaux = btpProducts.filter(p => p.isNouveau || p.isNouveau === true || p.isNouveau === 1);
        const displayNouveaux = customNouveaux.length > 0 
          ? customNouveaux 
          : [...btpProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

        return (
          <CategoryScrollSection
            category={{ id: "new", nom: "Nouveaux Arrivages Matériaux" }}
            products={displayNouveaux}
            onNavigate={() => navigate("/catalogue")}
          />
        );
      })()}

      {/* BANNIÈRES PROMOTIONNELLES / SLIDE BANNERS (JUSTE EN BAS DE NOUVEAUX ARRIVAGES) */}
      {sideBanners.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: sideBanners.length === 1 ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginTop: 16,
          marginBottom: 40,
          width: "100%"
        }}>
          {sideBanners.map((sb, idx) => (
            <div
              key={idx}
              onClick={() => handleBannerClick(sb)}
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                height: 220,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                border: "1px solid var(--line)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <img
                src={sb.imageUrl}
                alt={sb.title || "Banner"}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  imageRendering: "-webkit-optimize-contrast"
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.35) 50%, transparent 100%)",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end"
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  padding: "4px 12px",
                  borderRadius: 20,
                  width: "fit-content",
                  marginBottom: 8
                }}>
                  Édition Spéciale
                </div>
                {sb.title && <div style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(17px, 2vw, 21px)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{sb.title}</div>}
                {sb.subtitle && <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 4, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{sb.subtitle}</div>}
              </div>
            </div>
          ))}
        </div>
      )}


      {/* 6. SECTIONS PAR FAMILLE / CATÉGORIE (LIMITÉES À 3 SECTIONS MAXIMUM SUR L'ACCUEIL) */}
      {(() => {
        const sectionsWithProducts = uniqueFamilles
          .map((famName) => {
            const normTarget = famName.toLowerCase();
            const famProds = safeProducts.filter(p => {
              const pFam = getNormalizedFamilleName(p.Category?.famille || p.famille);
              return pFam.toLowerCase() === normTarget;
            });
            return { famName, normTarget, famProds };
          })
          .filter(s => s.famProds.length > 0);

        const displayedSections = sectionsWithProducts.slice(0, 3);

        return (
          <>
            {displayedSections.map(({ famName, normTarget, famProds }) => (
              <CategoryScrollSection
                key={normTarget}
                category={{ id: `fam-${normTarget}`, nom: `Section ${famName}` }}
                products={famProds}
                onNavigate={() => navigate(`/catalogue?famille=${encodeURIComponent(famName)}`)}
              />
            ))}

            {/* BOUTON POUR VOIR TOUTES LES SECTIONS ET TOUT LE CATALOGUE */}
            <div style={{ textAlign: "center", marginTop: 36, marginBottom: 28 }}>
              <button
                type="button"
                onClick={() => navigate("/catalogue")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 34px",
                  borderRadius: 30,
                  fontSize: 15,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, var(--forest-dark, #831843), var(--forest, #BE185D))",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(190, 24, 93, 0.28)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 26px rgba(190, 24, 93, 0.38)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(190, 24, 93, 0.28)";
                }}
              >
                <span>Voir toutes les sections & tout le catalogue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        );
      })()}



      {/* 8. SECTION CE QUE DISENT NOS CLIENTS (TÉMOIGNAGES WHATSAPP EN FIN JUSTE AVANT LE FOOTER) */}
      {filteredTestimonials.length > 0 && (
        <div style={{ marginTop: 48, marginBottom: 32, background: "var(--card)", padding: "28px 20px", borderRadius: 24, border: "1px solid var(--line)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#DCFCE7", color: "#15803D", padding: "4px 10px", borderRadius: 16, fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <MessageCircle size={14} /> Retours Vérifiés WhatsApp
                </span>
                <span style={{ fontSize: 13, color: "#F59E0B", fontWeight: 800 }}>⭐⭐⭐⭐⭐ 4.9/5</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: "6px 0 0", color: "var(--ink)", letterSpacing: "0.3px" }}>
                Ce que nos clients disent
              </h2>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 13 }}>
                Messages et captures réelles envoyées par nos clients après réception de leurs commandes.
              </p>
            </div>
          </div>

          {/* DÉFILEMENT CONTINU INFINI EN BOUCLE (PAUSE AU SURVOL) */}
          <div className="bs-testimonials-container">
            <div className="bs-testimonials-track">
              {displayTestimonials.map((t, index) => (
                <div 
                  key={`${t.id}-${index}`} 
                  className="bs-testimonial-card"
                  onClick={() => setActiveModalTestimonial(t)}
                  title="Cliquez pour agrandir et lire l'avis"
                >
                  {/* EN-TÊTE DU CLIENT */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <img 
                      src={t.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
                      alt={t.nom} 
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #25D366" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.nom}
                        </span>
                        <CheckCircle size={14} color="#16A34A" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        {Array.from({ length: t.note || 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CONTENU DE L'AVIS */}
                  {t.type === "capture_whatsapp" && t.captureUrl ? (
                    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)", background: "var(--paper)", marginBottom: 10 }}>
                      <img 
                        src={t.captureUrl} 
                        alt="Capture WhatsApp" 
                        style={{ width: "100%", height: 170, objectFit: "cover" }} 
                      />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 80%)",
                        padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontSize: 11.5, fontWeight: 700
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={13} color="#25D366" /> Capture vérifiée</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.25)", padding: "2px 8px", borderRadius: 12 }}><ZoomIn size={12} /> Voir</span>
                      </div>
                    </div>
                  ) : null}

                  {t.message && (
                    <div className="bs-testimonial-message">
                      "{t.message}"
                    </div>
                  )}

                  <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      Avis Client Vérifié
                    </span>
                    <span style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 800 }}>
                      ✓ Reçu sur WhatsApp
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- MODAL LIGHTBOX PLEIN ÉCRAN POUR VOIR LA CAPTURE ET LE TEXTE EN GRAND AVEC BOUTON FERMER ---- */}
      {activeModalTestimonial && (
        <div 
          onClick={() => setActiveModalTestimonial(null)}
          className="bs-testimonial-modal-backdrop"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bs-testimonial-modal-dialog"
            style={{
              borderRadius: 24, maxWidth: 650, width: "100%", maxHeight: "90vh",
              overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.35)", position: "relative",
              display: "flex", flexDirection: "column"
            }}
          >
            {/* EN-TÊTE MODALE AVEC BOUTON FERMER (X) BIEN VISIBLE */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img 
                  src={activeModalTestimonial.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
                  alt={activeModalTestimonial.nom} 
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #25D366" }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>{activeModalTestimonial.nom}</h3>
                    <CheckCircle size={16} color="#16A34A" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    {Array.from({ length: activeModalTestimonial.note || 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 700, marginLeft: 6 }}>• Avis vérifié WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* BOUTON FERMER TRÈS CLAIR */}
              <button
                onClick={() => setActiveModalTestimonial(null)}
                className="bs-testimonial-close-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  borderRadius: 20,
                  padding: "8px 16px", fontSize: 13, fontWeight: 800,
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <X size={18} /> Fermer
              </button>
            </div>

            {/* CORPS DE LA MODALE */}
            <div style={{ padding: 24 }}>
              {activeModalTestimonial.captureUrl ? (
                <div style={{ marginBottom: 18, borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", background: "#0F172A", textAlign: "center" }}>
                  <img 
                    src={activeModalTestimonial.captureUrl} 
                    alt="Capture d'écran du message WhatsApp" 
                    style={{ width: "100%", maxHeight: "55vh", objectFit: "contain", display: "block" }} 
                  />
                </div>
              ) : null}

              {activeModalTestimonial.message && (
                <div className="bs-testimonial-modal-msg">
                  <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageCircle size={15} /> Message envoyé par {activeModalTestimonial.nom} :
                  </div>
                  "{activeModalTestimonial.message}"
                </div>
              )}
            </div>

            {/* PIED DE MODALE AVEC BOUTON FERMER */}
            <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--paper)", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setActiveModalTestimonial(null)}
                className="bs-btn-primary"
                style={{ padding: "8px 24px", borderRadius: 20 }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DÉTAILS SERVICE BTP & CONTACT CHEF D'ÉQUIPE */}
      {activeServiceModal && (
        <div 
          className="bs-modal-overlay" 
          onClick={() => setActiveServiceModal(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              background: "#fff",
              borderRadius: 24,
              width: "100%",
              maxWidth: 640,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid var(--line)"
            }}
          >
            {/* Header image du service */}
            <div style={{ position: "relative", height: 220, overflow: "hidden", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <img 
                src={activeServiceModal.imageUrl} 
                alt={activeServiceModal.nom}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.85), transparent 70%)" }} />
              
              <button
                onClick={() => setActiveServiceModal(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(4px)"
                }}
              >
                <X size={20} />
              </button>

              <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                <span style={{
                  background: "#EA580C", color: "#fff",
                  padding: "3px 10px", borderRadius: 12,
                  fontSize: 11, fontWeight: 800, textTransform: "uppercase"
                }}>
                  Service BTP
                </span>
                <h3 style={{ margin: "6px 0 0", color: "#fff", fontSize: 22, fontWeight: 900 }}>
                  {activeServiceModal.nom}
                </h3>
              </div>
            </div>

            {/* Contenu */}
            <div style={{ padding: "24px" }}>
              {/* Tarif & Type */}
              <div style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                borderRadius: 14, padding: "12px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 20
              }}>
                <div>
                  <span style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Tarification</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0F766E", marginTop: 2 }}>
                    {activeServiceModal.tarif || "Sur devis gratuit"}
                  </div>
                </div>
                <span style={{ background: "#CCFBF1", color: "#0F766E", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                  {activeServiceModal.typeTarif === "journee" ? "Par journée" : activeServiceModal.typeTarif === "m2" ? "Au m²" : "Sur devis chantier"}
                </span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px" }}>
                  Ce que propose notre entreprise :
                </h4>
                <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                  {activeServiceModal.description || "Prestation de haute qualité réalisée par nos artisans BTP expérimentés."}
                </p>
              </div>

              {/* Conditions */}
              {activeServiceModal.conditions && (
                <div style={{ marginBottom: 20, background: "#FEFCE8", border: "1px solid #FEF08A", borderRadius: 14, padding: "14px 16px" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: "#854D0E", margin: "0 0 6px" }}>
                    Conditions d'intervention & Déplacements :
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#713F12", lineHeight: 1.5 }}>
                    {activeServiceModal.conditions}
                  </p>
                </div>
              )}

              {/* Responsable / Chef de chantier */}
              {activeServiceModal.chefNom && (
                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, border: "1px solid var(--line)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HardHat size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Responsable de l'équipe</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{activeServiceModal.chefNom}</div>
                  </div>
                </div>
              )}

              {/* Photos de Réalisations de ce service */}
              {Array.isArray(activeServiceModal.photosRealisation) && activeServiceModal.photosRealisation.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", margin: "0 0 10px" }}>
                    Chantiers et projets déjà réalisés :
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                    {activeServiceModal.photosRealisation.map((pUrl, pIdx) => (
                      <div key={pIdx} style={{ height: 100, borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)" }}>
                        <img src={pUrl} alt={`Réalisation ${pIdx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton Contact WhatsApp Direct */}
              {(() => {
                const phone = (activeServiceModal.chefTelephone || boutique?.whatsappNumber || boutique?.telephone || "+269 333 00 00").replace(/[^0-9]/g, "");
                const msg = `Bonjour,\n\nJe souhaite échanger à propos de votre service : *${activeServiceModal.nom}*.\nTarif indicatif : ${activeServiceModal.tarif || "Sur devis"}.\nPouvez-vous me renseigner sur vos disponibilités et organiser une visite de chantier ?`;
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
    </>
  );
}
