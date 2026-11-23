const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./backend/.env" });

async function cleanAndSeed() {
  console.log("🚀 Nettoyage et initialisation stricte BTP pour constructiondb...");

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
    database: process.env.DB_NAME || "constructiondb",
    port: process.env.DB_PORT || 3306
  });

  try {
    // 1. Trouver la boutique
    const [boutiques] = await conn.execute("SELECT id, slug, nom FROM boutiques LIMIT 1");
    if (!boutiques.length) {
      throw new Error("Aucune boutique trouvée");
    }
    const boutiqueId = boutiques[0].id;
    console.log(`🏢 Boutique cible : ${boutiques[0].nom} (ID: ${boutiqueId})`);

    // Mettre à jour les informations de la boutique
    await conn.execute(`
      UPDATE boutiques SET 
        nom = 'Établissement Lihoma BTP',
        couleur_principale = '#F59E0B',
        devise = 'KMF',
        telephone = '+269 342 08 08',
        whatsapp_number = '+269 342 08 08',
        email_contact = 'contact@etablissementlihoma.com',
        adresse = 'Dépôt Central Mboudé - Ntsaweni, Ngazidja, Comores',
        zones_livraison = 'Moroni, Mboudé, Bambao, Itsandra, Mitsamiouli, Hamahamet, Dimani, Badgini, Oichili',
        a_propos_text = 'Fondé pour accompagner les bâtisseurs comoriens et la diaspora, l''Établissement Lihoma est la référence pour vos approvisionnements en matériaux de construction aux Comores. Gravier concassé, sable noir de carrière, ciment Portland, fer à béton et services de maçonnerie, plomberie et toiture avec camions de chantier dédiés.'
      WHERE id = ?
    `, [boutiqueId]);

    // 2. Nettoyer les anciennes catégories et produits téléphonie (IDs 1 à 7 pour catégories, 1 à 12 pour produits)
    console.log("🧹 Suppression des anciens produits et catégories de téléphonie...");
    
    // Supprimer les dépendances dans order_items et reviews pour les anciens produits si besoin
    await conn.execute("DELETE FROM reviews WHERE product_id IN (SELECT id FROM products WHERE category_id IN (1,2,3,4,5,6,7))");
    await conn.execute("DELETE FROM order_items WHERE product_id IN (SELECT id FROM products WHERE category_id IN (1,2,3,4,5,6,7))");
    await conn.execute("DELETE FROM products WHERE category_id IN (1,2,3,4,5,6,7) OR nom LIKE '%iPhone%' OR nom LIKE '%Samsung%' OR nom LIKE '%Chargeur%' OR nom LIKE '%Coque%' OR nom LIKE '%Glace%' OR nom LIKE '%AirPods%' OR nom LIKE '%Powerbank%'");
    
    await conn.execute("DELETE FROM familles WHERE category_id IN (1,2,3,4,5,6,7)");
    await conn.execute("DELETE FROM categories WHERE id IN (1,2,3,4,5,6,7) OR nom LIKE '%Chargeur%' OR nom LIKE '%Glace%' OR nom LIKE '%Coque%' OR nom LIKE '%Écouteur%' OR nom LIKE '%Câble%' OR nom LIKE '%Powerbank%' OR nom LIKE '%Support%'");

    console.log("✅ Anciennes catégories et anciens produits supprimés avec succès.");

    // 3. Définir les 8 catégories BTP avec photos haute résolution et descriptions
    const categoriesBtp = [
      {
        nom: "Ciment & Liants",
        famille: "Gros Œuvre",
        description: "Ciment Portland 42.5R, chaux, colles carrelage et mortiers prêts à l'emploi",
        icone: "📦",
        ordre: 1,
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Fer à béton & Métallerie",
        famille: "Gros Œuvre",
        description: "Barres fer torsadé HA Ø 8 à 16, treillis soudés, fils de fer et étriers",
        icone: "▦",
        ordre: 2,
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Sable & Gravier",
        famille: "Gros Œuvre",
        description: "Sable noir concassé de carrière et gravier pour béton par camion complet 8 m³",
        icone: "🏔️",
        ordre: 3,
        imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Bois & Planches",
        famille: "Menuiserie & Coffrage",
        description: "Planches de coffrage, chevrons, madriers et bastaings bois rouge traité",
        icone: "🪵",
        ordre: 4,
        imageUrl: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Contreplaqué & Panneaux",
        famille: "Menuiserie & Coffrage",
        description: "Contreplaqué marine hydrofuge, MDF et panneaux de coffrage bakélisés",
        icone: "🥞",
        ordre: 5,
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Quincaillerie",
        famille: "Quincaillerie & Fixations",
        description: "Clous acier, vis à bois, boulons charpente, chevilles et charnières",
        icone: "🔧",
        ordre: 6,
        imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Outillage",
        famille: "Outillage BTP",
        description: "Brouettes renforcées, pelles de chantier, pioches, truelles et niveaux",
        icone: "🔨",
        ordre: 7,
        imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80"
      },
      {
        nom: "Peinture & Finition",
        famille: "Finition",
        description: "Peintures extérieures anti-humidité, enduits de lissage, rouleaux et pinceaux",
        icone: "🎨",
        ordre: 8,
        imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80"
      }
    ];

    const catIdMap = {};
    for (const cat of categoriesBtp) {
      const [existing] = await conn.execute(
        "SELECT id FROM categories WHERE boutique_id = ? AND nom = ?",
        [boutiqueId, cat.nom]
      );
      if (existing.length > 0) {
        await conn.execute(
          "UPDATE categories SET famille = ?, description = ?, icone = ?, ordre = ?, image_url = ? WHERE id = ?",
          [cat.famille, cat.description, cat.icone, cat.ordre, cat.imageUrl, existing[0].id]
        );
        catIdMap[cat.nom] = existing[0].id;
      } else {
        const [insertRes] = await conn.execute(
          "INSERT INTO categories (boutique_id, nom, famille, description, icone, ordre, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
          [boutiqueId, cat.nom, cat.famille, cat.description, cat.icone, cat.ordre, cat.imageUrl]
        );
        catIdMap[cat.nom] = insertRes.insertId;
      }
    }
    console.log("✅ 8 Catégories BTP configurées avec leurs photos :", catIdMap);

    // 4. Mettre à jour les produits phares de construction (avec correspondances exactes des maquettes)
    const productsBtp = [
      {
        nom: "Brouette Renforcée de Chantier (Roue Pleine)",
        volume: "100 Litres",
        unite: "unité",
        prix: 25000,
        prixParDevise: JSON.stringify({ KMF: 25000, EUR: 50.0 }),
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: true,
        isRecommande: false,
        isNouveau: false,
        stock: 35,
        categoryId: catIdMap["Outillage"],
        imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
        description: "Brouette robuste châssis tubulaire renforcé et cuve galvanisée emboutie. Roue increvable idéale pour le transport de sable, gravier et mortier sur chantiers accidentés."
      },
      {
        nom: "Ciment Portland 42.5R - Tonne (20 sacs de 50 kg)",
        volume: "1 Tonne (20 sacs)",
        unite: "tonne",
        prix: 98750,
        prixParDevise: JSON.stringify({ KMF: 98750, EUR: 200.0 }),
        isPrixFixe: true,
        disponibilite: "sur_commande",
        delaiCommande: "1 à 2 semaines",
        isPlusVendu: true,
        isRecommande: false,
        isNouveau: false,
        stock: 120,
        categoryId: catIdMap["Ciment & Liants"],
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        description: "Ciment haute résistance CPJ 42.5 pour ouvrages en béton armé, fondations, piliers, linteaux et dalles étanches. Livré sur palette par camion."
      },
      {
        nom: "Sable noir de carrière concassé (voyage de 8 m³)",
        volume: "8 m³",
        unite: "camion",
        prix: 212300,
        prixParDevise: JSON.stringify({ KMF: 212300, EUR: 420.0 }),
        isPrixFixe: false,
        disponibilite: "sur_commande",
        delaiCommande: "1 à 2 semaines",
        isPlusVendu: true,
        isRecommande: false,
        isNouveau: false,
        stock: 80,
        categoryId: catIdMap["Sable & Gravier"],
        imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
        description: "Sable volcanique de carrière lavé et calibré, sans résidus argileux. Idéal pour la fabrication de parpaings solides, mortiers de pose et crépissage."
      },
      {
        nom: "Gravier concassé pour béton (voyage de 8 m³)",
        volume: "8 m³",
        unite: "camion",
        prix: 167850,
        prixParDevise: JSON.stringify({ KMF: 167850, EUR: 340.0 }),
        isPrixFixe: false,
        disponibilite: "sur_commande",
        delaiCommande: "1 à 2 semaines",
        isPlusVendu: false,
        isRecommande: false,
        isNouveau: false,
        stock: 80,
        categoryId: catIdMap["Sable & Gravier"],
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80",
        description: "Gravier concassé 15/25 mm pour béton de structure, semelles filantes et dalles de compression. Livré par camion benne de 8 m³ directement sur site."
      },
      {
        nom: "Clous & Pointes Acier de Charpente (Carton 5 kg)",
        volume: "Carton 5 kg",
        unite: "kg",
        prix: 1500,
        prixParDevise: JSON.stringify({ KMF: 1500, EUR: 3.0 }),
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: false,
        isNouveau: false,
        stock: 250,
        categoryId: catIdMap["Quincaillerie"],
        imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
        description: "Pointes en acier dur haute résistance pour coffrage bois, toitures et assemblages de charpentes traditionnelles."
      },
      {
        nom: "Panneau Contreplaqué Coffrage Marine 4 mm",
        volume: "244 x 122 cm",
        unite: "unité",
        prix: 7900,
        prixParDevise: JSON.stringify({ KMF: 7900, EUR: 16.0 }),
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: false,
        isNouveau: true,
        stock: 90,
        categoryId: catIdMap["Contreplaqué & Panneaux"],
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        description: "Panneau contreplaqué bakélisé résistant à l'humidité tropicale pour coffrage lisse de poteaux et dalles de béton."
      },
      {
        nom: "Fer à béton Haute Adhérence HA Ø 12 (12 m)",
        volume: "Barre 12 m",
        unite: "barre",
        prix: 4200,
        prixParDevise: JSON.stringify({ KMF: 4200, EUR: 8.5 }),
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: true,
        isRecommande: false,
        isNouveau: false,
        stock: 450,
        categoryId: catIdMap["Fer à béton & Métallerie"],
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        description: "Barre d'acier nervuré haute adhérence FeE500 de 12 mm de diamètre. Indispensable pour poteaux, chaînages et armatures principales."
      },
      {
        nom: "Madrier Bois Rouge Traité 8x15 (Longueur 4 m)",
        volume: "8 x 15 cm x 4 m",
        unite: "unité",
        prix: 8500,
        prixParDevise: JSON.stringify({ KMF: 8500, EUR: 17.0 }),
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: false,
        isNouveau: true,
        stock: 140,
        categoryId: catIdMap["Bois & Planches"],
        imageUrl: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80",
        description: "Madrier en bois rouge scié de premier choix traité contre les insectes xylophages. Convient pour charpentes lourdes et étaiement."
      },
      {
        nom: "Peinture Façade Étanche Extérieure Anti-Moisissure (20 kg)",
        volume: "Seau 20 kg",
        unite: "seau",
        prix: 28000,
        prixParDevise: JSON.stringify({ KMF: 28000, EUR: 56.0 }),
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: false,
        isNouveau: true,
        stock: 75,
        categoryId: catIdMap["Peinture & Finition"],
        imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
        description: "Peinture acrylique microporeuse haute protection contre l'air marin et les fortes précipitations tropicales des Comores."
      }
    ];

    for (const prod of productsBtp) {
      const [existing] = await conn.execute(
        "SELECT id FROM products WHERE boutique_id = ? AND nom = ?",
        [boutiqueId, prod.nom]
      );
      if (existing.length > 0) {
        await conn.execute(`
          UPDATE products SET 
            volume = ?, unite = ?, prix = ?, prix_par_devise = ?, is_prix_fixe = ?,
            disponibilite = ?, delai_commande = ?, is_plus_vendu = ?, is_recommande = ?,
            is_nouveau = ?, stock = ?, category_id = ?, image_url = ?, description = ?,
            masquer_sur_site = 0, updated_at = NOW()
          WHERE id = ?
        `, [
          prod.volume, prod.unite, prod.prix, prod.prixParDevise, prod.isPrixFixe ? 1 : 0,
          prod.disponibilite, prod.delaiCommande || "1 à 2 semaines aux Comores",
          prod.isPlusVendu ? 1 : 0, prod.isRecommande ? 1 : 0,
          prod.isNouveau ? 1 : 0, prod.stock, prod.categoryId, prod.imageUrl, prod.description,
          existing[0].id
        ]);
      } else {
        await conn.execute(`
          INSERT INTO products (
            boutique_id, category_id, nom, description, prix, prix_par_devise,
            volume, unite, is_prix_fixe, disponibilite, delai_commande,
            is_plus_vendu, is_recommande, is_nouveau, stock, image_url,
            masquer_sur_site, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
        `, [
          boutiqueId, prod.categoryId, prod.nom, prod.description, prod.prix, prod.prixParDevise,
          prod.volume, prod.unite, prod.isPrixFixe ? 1 : 0, prod.disponibilite,
          prod.delaiCommande || "1 à 2 semaines aux Comores",
          prod.isPlusVendu ? 1 : 0, prod.isRecommande ? 1 : 0,
          prod.isNouveau ? 1 : 0, prod.stock, prod.imageUrl
        ]);
      }
    }
    console.log("✅ Produits BTP enregistrés et nettoyés.");

    // 5. Configurer les comptes utilisateurs
    const hash = (pw) => bcrypt.hashSync(pw, 10);
    const users = [
      { email: "superadmin@boutique-saas.com", nom: "Super Admin Plateforme", role: "super_admin", pw: "SuperAdmin123!" },
      { email: "admin@etablissementlihoma.com", nom: "Soilihi Abdou (Direction BTP)", role: "admin", pw: "Admin123!" },
      { email: "admin@soilihitech.com", nom: "Soilihi Abdou (Admin)", role: "admin", pw: "Admin123!" },
      { email: "vendeur@soilihitech.com", nom: "Vendeur & Caissier Dépôt", role: "employe", pw: "Employe123!" },
      { email: "client@example.com", nom: "Client BTP Test", role: "client", pw: "Client123!" }
    ];

    for (const u of users) {
      const [ex] = await conn.execute("SELECT id FROM users WHERE email = ?", [u.email]);
      if (ex.length > 0) {
        await conn.execute("UPDATE users SET mot_de_passe_hash = ?, role = ?, boutique_id = ? WHERE id = ?", [hash(u.pw), u.role, boutiqueId, ex[0].id]);
      } else {
        await conn.execute("INSERT INTO users (email, nom, role, mot_de_passe_hash, boutique_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())", [u.email, u.nom, u.role, hash(u.pw), boutiqueId]);
      }
    }
    console.log("✅ Comptes utilisateurs configurés.");

    await conn.end();
    console.log("🎉 Nettoyage et initialisation terminés avec SUCCÈS !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur pendant le nettoyage :", err);
    await conn.end();
    process.exit(1);
  }
}

cleanAndSeed();
