const bcrypt = require("bcryptjs");
const { sequelize, Boutique, User, Category, Product, Service, Marque } = require("./models");

async function seedBtp() {
  console.log("🌱 Début de l'initialisation BTP pour constructiondb...");

  try {
    await sequelize.authenticate();
    console.log("✅ Connexion réussie à constructiondb sur XAMPP MySQL (127.0.0.1:3306).");

    // Sync database schema (alter: true creates/updates missing columns safely)
    await sequelize.sync({ alter: true });
    console.log("✅ Synchronisation des tables effectuée avec succès.");

    const hash = (pw) => bcrypt.hashSync(pw, 10);

    // 1. Boutique BTP Lihoma
    let boutique = await Boutique.findOne({ where: { slug: "economestore" } });
    if (!boutique) {
      boutique = await Boutique.findOne();
    }

    const btpData = {
      nom: "Établissement Lihoma BTP",
      slug: boutique ? boutique.slug : "economestore",
      description: "Matériaux de Construction & BTP - Mboudé & Ngazidja",
      couleurPrincipale: "#F59E0B",
      couleurSecondaire: "#0F4C81",
      devise: "KMF",
      telephone: "+269 342 08 08",
      emailContact: "contact@etablissementlihoma.com",
      adresse: "Dépôt Central Mboudé - Ntsaweni, Ngazidja, Comores",
      zonesLivraison: "Moroni, Mboudé, Bambao, Itsandra, Mitsamiouli, Hamahamet, Dimani, Badgini, Oichili",
      aProposText: "Fondé pour accompagner les bâtisseurs comoriens et la diaspora, l'Établissement Lihoma est la référence pour vos approvisionnements en matériaux de construction aux Comores. Gravier concassé, sable noir de carrière, ciment Portland, fer à béton et services de maçonnerie, plomberie et toiture avec camions de chantier dédiés.",
      bannerSlides: [
        {
          id: 1,
          tag: "🏗️ CHANTIERS & GROS ŒUVRE AUX COMORES",
          title: "Matériaux de Construction Certifiés",
          subtitle: "Gravier concassé par camion de 8 m³, sable de carrière, fer à béton HA et ciment Portland livré directement sur vos chantiers.",
          imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1400&q=80",
          buttonText: "Commander mes matériaux",
          linkUrl: "/catalogue",
          editorial: "Établissement Lihoma BTP",
          objectPosition: "center center"
        },
        {
          id: 2,
          tag: "🚚 ROTATIONS RAPIDES PAR CAMIONS BENNES",
          title: "Livraison de Sable & Gravier",
          subtitle: "Approvisionnement direct carrières en 1 à 2 semaines sur toute l'île de Ngazidja avec déchargement sur site.",
          imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=80",
          buttonText: "Voir le sable & gravier",
          linkUrl: "/catalogue?famille=Gros%20%C5%92uvre",
          editorial: "Logistique BTP Comores",
          objectPosition: "center center"
        }
      ]
    };

    if (boutique) {
      await boutique.update(btpData);
      console.log(`✅ Boutique mise à jour : ${boutique.nom} (ID: ${boutique.id})`);
    } else {
      boutique = await Boutique.create(btpData);
      console.log(`✅ Boutique créée : ${boutique.nom} (ID: ${boutique.id})`);
    }

    // 2. Utilisateurs Admin & Vendeur
    await User.findOrCreate({
      where: { email: "admin@etablissementlihoma.com" },
      defaults: {
        nom: "Soilihi Abdou (Direction BTP)",
        email: "admin@etablissementlihoma.com",
        motDePasseHash: hash("Admin123!"),
        role: "admin",
        boutiqueId: boutique.id
      }
    });

    // 3. Les 8 Catégories BTP (Maquette Image 5)
    const categoriesData = [
      {
        nom: "Ciment & Liants",
        slug: "ciment-liants",
        description: "Ciment Portland, chaux, colles et mortiers",
        icone: "📦",
        ordre: 1,
        boutiqueId: boutique.id
      },
      {
        nom: "Fer à béton & Métallerie",
        slug: "fer-a-beton-metallerie",
        description: "Barres HA, treillis soudés, fils de fer",
        icone: "▦",
        ordre: 2,
        boutiqueId: boutique.id
      },
      {
        nom: "Sable & Gravier",
        slug: "sable-gravier",
        description: "Sable noir concassé, gravier par camion 8 m³",
        icone: "🏔️",
        ordre: 3,
        boutiqueId: boutique.id
      },
      {
        nom: "Bois & Planches",
        slug: "bois-planches",
        description: "Planches, chevrons, madriers de coffrage",
        icone: "🪵",
        ordre: 4,
        boutiqueId: boutique.id
      },
      {
        nom: "Contreplaqué & Panneaux",
        slug: "contreplaque-panneaux",
        description: "Contreplaqué marine, MDF, coffrage filmé",
        icone: "🥞",
        ordre: 5,
        boutiqueId: boutique.id
      },
      {
        nom: "Quincaillerie",
        slug: "quincaillerie",
        description: "Clous, vis, boulons, charnières de charpente",
        icone: "🔧",
        ordre: 6,
        boutiqueId: boutique.id
      },
      {
        nom: "Outillage",
        slug: "outillage",
        description: "Brouettes, pelles, pioches, truelles, casques",
        icone: "🔨",
        ordre: 7,
        boutiqueId: boutique.id
      },
      {
        nom: "Peinture & Finition",
        slug: "peinture-finition",
        description: "Peintures, enduits, pinceaux, rouleaux",
        icone: "🎨",
        ordre: 8,
        boutiqueId: boutique.id
      }
    ];

    const catMap = {};
    for (const c of categoriesData) {
      const [catObj] = await Category.findOrCreate({
        where: { slug: c.slug, boutiqueId: boutique.id },
        defaults: c
      });
      await catObj.update({ description: c.description, icone: c.icone, ordre: c.ordre });
      catMap[c.slug] = catObj;
    }
    console.log("✅ 8 Catégories BTP configurées.");

    // 4. Les 6 Services BTP (Maquette Image 2)
    const servicesData = [
      {
        nom: "Maçonnerie",
        slug: "maconnerie",
        description: "Élévation de murs en parpaings, chaînages, coulage de dalles, radiers et gros œuvre complet par des maçons expérimentés.",
        conditions: "Intervention sur toute l'île de Grande Comore. Matériaux et échafaudages gérés sur demande.",
        tarif: 15000,
        typeTarif: "jour",
        chefNom: "Ali Mze (Chef Maçon)",
        chefTelephone: "+269 342 08 08",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        photosRealisation: [
          "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
        ],
        ordre: 1,
        boutiqueId: boutique.id
      },
      {
        nom: "Électricité",
        slug: "electricite",
        description: "Installation électrique complète basse tension, coffrets disjoncteurs, tirage de câbles, prises et éclairages LED pour chantiers et habitations.",
        conditions: "Schéma unifilaire et mise aux normes de sécurité électrique inclus.",
        tarif: 20000,
        typeTarif: "devis",
        chefNom: "Saïd Ahmed (Électricien Agréé)",
        chefTelephone: "+269 342 08 08",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        photosRealisation: [
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
        ],
        ordre: 2,
        boutiqueId: boutique.id
      },
      {
        nom: "Peinture",
        slug: "peinture",
        description: "Préparation des fonds, enduit de lissage, sous-couches et application de peinture mate ou satinée anti-humidité intérieure et extérieure.",
        conditions: "Fourniture de la peinture Lihoma ou main-d'œuvre seule au m².",
        tarif: 1500,
        typeTarif: "m2",
        chefNom: "Kassim Toihir (Peintre Finition)",
        chefTelephone: "+269 342 08 08",
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        photosRealisation: [
          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
        ],
        ordre: 3,
        boutiqueId: boutique.id
      },
      {
        nom: "Carrelage",
        slug: "carrelage",
        description: "Pose professionnelle de carrelage au sol, faïence murale de salles de bains et terrasses extérieures avec joints hydrofuges.",
        conditions: "Ragréage et calepinage précis réalisés avant pose.",
        tarif: 2500,
        typeTarif: "m2",
        chefNom: "Youssouf Bacar (Carreleur)",
        chefTelephone: "+269 342 08 08",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        photosRealisation: [
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
        ],
        ordre: 4,
        boutiqueId: boutique.id
      },
      {
        nom: "Plomberie",
        slug: "plomberie",
        description: "Réseau d'évacuation PVC, alimentation multicouche et PER, pose de chauffe-eau, cuves à eau et sanitaires avec test d'étanchéité garanti.",
        conditions: "Garantie d'étanchéité avec visite de contrôle 48h après mise en eau.",
        tarif: 18000,
        typeTarif: "jour",
        chefNom: "Fahad Mohamed (Plombier Sanitaire)",
        chefTelephone: "+269 342 08 08",
        imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
        photosRealisation: [
          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"
        ],
        ordre: 5,
        boutiqueId: boutique.id
      },
      {
        nom: "Architecture & Suivi de Chantier",
        slug: "architecture",
        description: "Conception de plans 2D/3D, métrés précis, estimation quantitative et supervision technique des fondations à la toiture.",
        conditions: "Rendez-vous sur chantier ou échange à distance pour la diaspora.",
        tarif: 50000,
        typeTarif: "devis",
        chefNom: "Ing. Nassim Abdallah",
        chefTelephone: "+269 342 08 08",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
        photosRealisation: [
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
        ],
        ordre: 6,
        boutiqueId: boutique.id
      }
    ];

    for (const s of servicesData) {
      const [srvObj] = await Service.findOrCreate({
        where: { slug: s.slug, boutiqueId: boutique.id },
        defaults: s
      });
      await srvObj.update(s);
    }
    console.log("✅ 6 Services BTP enregistrés.");

    // 5. Matériaux et Produits BTP (Maquette Image 3 & Produits phares)
    const productsData = [
      {
        nom: "Gravier (voyage de 8m³)",
        volume: "8 m³",
        prix: 167850,
        isPrixFixe: false,
        disponibilite: "sur_commande",
        delaiCommande: "1 à 2 semaines",
        isPlusVendu: true,
        isRecommande: true,
        isNouveau: false,
        stock: 50,
        categoryId: catMap["sable-gravier"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
        description: "Gravier concassé pour béton et fondations, livré par voyage complet de 8 m³ directement sur le chantier. Frais de livraison inclus selon la zone."
      },
      {
        nom: "Sable noir de carrière (voyage de 8m³)",
        volume: "8 m³",
        prix: 125000,
        isPrixFixe: false,
        disponibilite: "sur_commande",
        delaiCommande: "1 à 2 semaines",
        isPlusVendu: true,
        isRecommande: true,
        isNouveau: false,
        stock: 50,
        categoryId: catMap["sable-gravier"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80",
        description: "Sable noir fin et propre pour mortiers de maçonnerie, crépissage et coulage de dalles. Livré par camion benne de 8 m³."
      },
      {
        nom: "Ciment Portland 42.5R (Sac de 50 kg)",
        volume: "50 kg",
        prix: 5500,
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: true,
        isRecommande: true,
        isNouveau: false,
        stock: 500,
        categoryId: catMap["ciment-liants"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        description: "Ciment haute résistance 42.5R pour béton armé, fondations, piliers et dalles. Prise rapide et grande résistance mécanique."
      },
      {
        nom: "Fer à béton Haute Adhérence HA Ø 12",
        volume: "Barre 12 m",
        prix: 4200,
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: true,
        isRecommande: true,
        isNouveau: false,
        stock: 300,
        categoryId: catMap["fer-a-beton-metallerie"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        description: "Barre de fer torsadé HA de 12 mm de diamètre, longueur 12 mètres standard pour ferraillage de poteaux, poutres et linteaux."
      },
      {
        nom: "Fer à béton Haute Adhérence HA Ø 10",
        volume: "Barre 12 m",
        prix: 3100,
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: true,
        isNouveau: false,
        stock: 350,
        categoryId: catMap["fer-a-beton-metallerie"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        description: "Barre de fer torsadé HA de 10 mm pour chaînages et armatures légères. Longueur standard de 12 mètres."
      },
      {
        nom: "Bastaing / Madrier Bois Rouge 8x15 (4m)",
        volume: "Longueur 4m",
        prix: 8500,
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: true,
        isNouveau: true,
        stock: 120,
        categoryId: catMap["bois-planches"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80",
        description: "Madrier en bois rouge traité contre les termites, idéal pour charpentes de toiture et étayage lourd de chantier."
      },
      {
        nom: "Panneau Contreplaqué Marine 18 mm",
        volume: "244 x 122 cm",
        prix: 14500,
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: false,
        isNouveau: true,
        stock: 80,
        categoryId: catMap["contreplaque-panneaux"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        description: "Contreplaqué marine hydrofuge résistant à l'eau de mer et aux intempéries tropicales. Pour coffrages répétés et menuiseries."
      },
      {
        nom: "Peinture Façade Étanche Extérieure (20 kg)",
        volume: "Seau 20 kg",
        prix: 28000,
        isPrixFixe: true,
        disponibilite: "en_stock",
        isPlusVendu: false,
        isRecommande: true,
        isNouveau: true,
        stock: 60,
        categoryId: catMap["peinture-finition"]?.id,
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        description: "Peinture microporeuse anti-moisissures pour murs extérieurs. Protège durablement du soleil comorien et des pluies tropicales."
      }
    ];

    for (const p of productsData) {
      const [prodObj] = await Product.findOrCreate({
        where: { nom: p.nom, boutiqueId: boutique.id },
        defaults: {
          ...p,
          boutiqueId: boutique.id,
          devise: "KMF",
          masquerSurSite: false
        }
      });
      await prodObj.update({
        ...p,
        masquerSurSite: false
      });
    }
    console.log("✅ 8 Produits BTP phares enregistrés avec double devise et spécifications.");

    console.log("\n🎉 SEED BTP TERMINÉ AVEC SUCCÈS POUR CONSTRUCTIONDB !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors du seed BTP :", err);
    process.exit(1);
  }
}

seedBtp();
