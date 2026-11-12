/* ============================================================
   CONFIG — c'est ICI que tu changes les textes, photos et vidéos.
   Pas besoin de toucher à script.js.
   ============================================================ */
var CONFIG = {
  // Date où vous êtes ensemble : [année, mois (0 = janvier), jour]
  together: [2025, 1, 5],

  // Pour mettre une vraie chanson : copie le fichier dans le dossier music/
  // puis écris par exemple  music: "music/chanson.mp3"
  // Laisse "" pour garder la petite mélodie douce intégrée.
  music: "music/chanson.mp3",

  // Chaque scène : bg (fond), stars (étoiles, de 0 à 1), bloom (fleurs), fw (feu d'artifice),
  // sepia (effet souvenir), chap (titre du chapitre), lines (les phrases),
  // media (photos/vidéos : une par phrase, dans l'ordre).
  // Une photo : {type:"photo", src:"photos/01.jpg"}
  // Une vidéo : {type:"video", src:"videos/01.mp4", sound:false}   (sound:true = avec le son de la vidéo)
  scenes: [
    { bg:"#000", stars:0,
      lines:[["Winner présente","hand"],["Un film pour Allegra","big"]], hold:1200 },

    { bg:"radial-gradient(80% 60% at 50% 40%,#0d1a3f,#000 80%)", stars:.35, sepia:true,
      chap:["Chapitre I","Avant toi"],
      media:[{type:"photo",src:"photos/01.jpeg"},{type:"photo",src:"photos/02.jpeg"},{type:"photo",src:"photos/03.jpeg"}],
      lines:[["Je te voyais comme une petite fille."],["Je ne voulais pas de relation."],["J’étais sûr de moi.","hand"]] },

    { bg:"radial-gradient(90% 70% at 50% 30%,#17348a,#050a1c 80%)", stars:1,
      chap:["Chapitre II","Le groupe de travail"],
      media:[{type:"photo",src:"photos/04.jpeg"},{type:"photo",src:"photos/05.jpeg"},{type:"photo",src:"photos/06.jpeg"}],
      lines:[["Et puis il y a eu ta timidité."],["Ton calme."],["Sans bruit, tu as pris toute la place.","big"]] },

    { bg:"radial-gradient(90% 70% at 50% 100%,#6b3a7a,#1a1f55 45%,#070d28)", stars:.5, bloom:1,
      chap:["Chapitre III","Le premier rendez-vous"],
      media:[{type:"photo",src:"photos/07.jpeg"},{type:"photo",src:"photos/08.jpeg"},{type:"photo",src:"photos/09.jpeg"},{type:"video",src:"videos/01.mp4"}],
      lines:[["Tu es venue chez moi pour travailler."],["J’ai voulu t’embrasser."],["Tu as eu honte.","hand"],["Et je t’ai trouvée encore plus adorable.","big"]] },

    { bg:"radial-gradient(90% 70% at 50% 40%,#1f55c8,#08153d 75%)", stars:.6, bloom:1,
      chap:["Chapitre IV","5 février 2025"],
      media:[{type:"photo",src:"photos/10.jpeg"},{type:"photo",src:"photos/11.jpeg"}],
      lines:[["Ce jour-là, nous sommes devenus nous.","big"],["@days"]] },

    { bg:"radial-gradient(90% 70% at 50% 50%,#2a3f9a,#0a1230 80%)", stars:.9,
      chap:["Chapitre V","Toi"],
      media:[{type:"photo",src:"photos/12.jpeg"},{type:"video",src:"videos/02.mp4"},{type:"photo",src:"photos/13.jpeg"},{type:"photo",src:"photos/14.jpeg"},{type:"photo",src:"photos/15.jpeg"}],
      lines:[["Intelligente."],["Drôle."],["Attentionnée."],["Et quand tu m’énerves… « itou gaillard »."],["Et quand mes yeux se promènent, la gifle arrive. Je la mérite.","hand"]] },

    { bg:"radial-gradient(90% 70% at 50% 60%,#142455,#04081a 80%)", stars:.8,
      chap:["Chapitre VI","Dans les moments difficiles"],
      lines:[["Quand ça ne va pas à la maison, tu es là."],["Tu m’écoutes. Tu compatis.","big"],["Merci.","hand"]] },

      

    { bg:"radial-gradient(90% 70% at 50% 40%,#3a2a8a,#06081f 75%)", stars:.9, fw:1,
      chap:["Chapitre final","13 novembre"],
      media:[{type:"photo",src:"photos/16.jpeg"},{type:"video",src:"videos/03.mp4"}],
    lines:[["19 ans.","big"],["Joyeux anniversaire,"],["Allegra","OKEMBA"],["Ma vie. Mon bb. Mon amour. Mon petit cœur.","hand"],["Et ma mère y’a palais 😄","hand"]], hold:3000 },
        { bg:"radial-gradient(90% 70% at 50% 40%,#5b3b8f,#0a0820 80%)", stars:1,
      chap:["Bénédictions","Pour tes 19 ans"],
      lines:[
        ["Que Dieu te bénisse, Allegra."],
        ["Qu’il garde ton cœur doux et ton sourire vivant."],
        ["Qu’il ouvre devant toi des portes que personne ne pourra fermer."],
        ["Qu’il te donne la santé, la sagesse et la paix, chaque jour de cette nouvelle année."],
        ["Que tes rêves deviennent réels, et que tu ailles plus loin que tu ne l’as imaginé.","big"]
      ], hold:2500 },

    { bg:"radial-gradient(90% 70% at 50% 60%,#142455,#04081a 80%)", stars:1,
      chap:["Pour finir","Ce que je veux te dire"],
      lines:[
        ["Allegra, je veux que tu saches une chose."],
        ["Tu n’es pas arrivée dans ma vie par hasard."],
        ["Avec toi, j’apprends la patience, la tendresse, et ce que veut dire choisir quelqu’un chaque jour."],
        ["Peu importe où la vie nous mènera, je veux marcher à côté de toi.","big"],
        ["Merci d’exister. Merci d’être toi.","hand"]
      ], hold:3000 },

    { bg:"radial-gradient(90% 70% at 50% 40%,#3a2a8a,#06081f 75%)", stars:.9, fw:1,
      lines:[["Je t’aime, Allegra.","big"]], hold:4500 }
  ],

  // Générique de fin (rôle, nom)
  credits: [
    ["Rôle principal","Allegra"],
    ["Réalisé par","Winner"],
    ["Scénario","Notre histoire, depuis le 5 février 2025"],
    ["Avec la participation de","« Itou gaillard »"],
    ["Cascades","Les gifles de Winner (aucun blessé)"],
    ["Effets spéciaux","Tout l’amour du monde"],
    ["Aucun cœur n’a été blessé","durant le tournage"]
  ],

  // Scène bonus, après le générique
  bonus: { bg:"#000", stars:.5, lines:[["Scène bonus","hand"],["Je t’aime encore plus demain.","big"]], hold:2500 }
};
