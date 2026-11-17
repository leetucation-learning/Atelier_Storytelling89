/* IS89 · Martorul anonim · configurarea cursului (se poate edita fără a atinge player-ul).
   - media: numele fișierelor video și PDF. Un nume gol = spațiul video rămâne gol, butonul nu apare.
     Pune fișierul în media/video/ (sau media/docs/) și scrie aici calea relativă, de ex. 'media/video/1-3_clip-cum-lucrezi_RO.mp4'.
   - Textele slide-urilor sunt în js/slides.js; vocea și subtitrarea în audio/vo.js (generate din tools/narration_src.py). */
window.IS89_CONFIG = {
  id: 'IS89_MartorulAnonim_RO',
  title: 'Imagine Sunet ’89. Martorul anonim',
  version: '0.7',
  storageKey: 'IS89_MartorulAnonim_RO_v04',
  wordLimit: 1000,

  media: {
    intro: 'media/brand/cp-logo-animat.mp4',
    // Clipurile opționale: 1 (1.3), 2 (2.3 · Ritm), 3 (3.1), 4 (3.2), 5 (4.9 și 5.1 · Coloana)
    clip1: '', clip2: '', clip3: '', clip4: '', clip5: '',
    clip1Vtt: '', clip2Vtt: '', clip3Vtt: '', clip4Vtt: '', clip5Vtt: '',
    // 2.2 · Cum construiești o poveste: două lecții de pe web care acoperă cele patru puncte (se deschid într-o filă nouă)
    web22a: 'https://www.khanacademy.org/partner-content/hass-storytelling/storytelling-pixar-in-a-box/ah-piab-story-structure/v/video1a-fine',   // Pixar in a Box, lecția Story structure: story spine, theme, act 1–3 (punctele 1, 3, 4)
    web22b: 'https://www.youtube.com/watch?v=iqAee-QsjMU',   // TED-Ed: Slowing down time (in writing & film), Aaron Sitze (punctul 2)
    // Videoclipurile Pixar de pe 2.5: linkul YouTube, se deschide într-o filă nouă (din invitație)
    web1: 'https://www.youtube.com/watch?v=1rMnzNZkIX0',   // Pixar in a Box: Introduction to Storytelling
    web2: 'https://www.youtube.com/watch?v=bKrCKg9ggVI',   // Pixar in a Box: Story Structure
    web3: 'https://www.youtube.com/watch?v=u8CpDHJuyF4',   // Pixar: 10 reguli de povestire
    // Documente
    invitatiePdf: 'media/docs/IS89_Invitatia.pdf'
  },

  // 5.6 · Rezultatele atelierului: poveștile elevilor (ca text) și fotografiile din atelier.
  // Datele sunt în js/rezultate.js (generat de tools/build_rezultate.py) și se încarcă doar când se deschide 5.6.
  // arataNumele: false = poveștile apar fără numele elevilor (de exemplu, dacă lipsește acordul pentru publicare).
  rezultate: { an: 2026, date: 'js/rezultate.js', arataNumele: true },

  // Cele patru cadre. Imaginile sunt decupajele din pachet (~500 px); înlocuiește-le cu originalele, cu același nume.
  frames: [
    { n: 1, img: 'media/cadre/0-0_cadru-1_RO.jpg', name: 'Cadrul 1 · Strada cu duba portocalie',
      alt: 'Stradă iarna: dubă portocalie cu ușile din spate deschise, un vehicul militar în stânga și o persoană întinsă pe trotuar.' },
    { n: 2, img: 'media/cadre/0-0_cadru-2_RO.jpg', name: 'Cadrul 2 · Mulțimea din jurul blindatului',
      alt: 'Mulțime de oameni în jurul unui vehicul blindat, pe o stradă cu clădiri vechi din cărămidă roșie.' },
    { n: 3, img: 'media/cadre/0-0_cadru-3_RO.jpg', name: 'Cadrul 3 · Bocancul și încărcătoarele',
      alt: 'Prim-plan: bocancul unui militar lângă încărcătoare de armă împrăștiate pe ciment.' },
    { n: 4, img: 'media/cadre/0-0_cadru-4_RO.jpg', name: 'Cadrul 4 · Militarii din piață',
      alt: 'Militari pe o piață pavată, plină de resturi; un tanc în dreapta și, în spate, o clădire mare cu o firmă de magazin.' }
  ],

  // Registrul de variabile (ca în Storyline): nume → valoare implicită
  vars: {
    nPlan_Cale: 0, nPlan_Titlu: 0, nPlan_Film: 0, nPlan_Foto: 0, nPlan_Narator: 0, nPlan_Persoana: 0,
    nPlan_Timp: 0, nPlan_Erou: 0, nPoveste_Cuvinte: 0,
    bL2_PartiVazute: false, bL3_CadreVazute: false, bPlan_Complet: false, bPoveste_Gata: false,
    tPlan_Q1: '', tPlan_Q1_DeCe: '', tPlan_Q2: '', tPlan_Q2_Titlu: '', tPlan_Q3: '', tPlan_Q3_Film: '',
    tPlan_Q4: '', tPlan_Q4_DeCe: '', tPlan_Q5_Inainte: '', tPlan_Q5_Dupa: '', tPlan_Q6_Narator: '',
    tPlan_Q6_Persoana: '', tPlan_Q6: '', tPlan_Q7_Timp: '', tPlan_Q7: '', tPlan_Q8: '', tPlan_Q8_Cine: '',
    tPlan_Q8_Drum: '', tPlan_Q8_Dileme: '', tPlan_Q9_Intamplare: '', tPlan_Q9_Mesaj: '', tPlan_Q9_Cititor: '',
    tPoveste_Titlu: '', tPoveste_Text: ''
  },

  // Modulele (meniul 1.4 și Cuprinsul)
  modules: [
    { n: 1, title: 'Înțelege invitația', desc: 'Invitația, un video scurt și cum se construiește o poveste.', to: '2.1' },
    { n: 2, title: 'Alege punctul de plecare', desc: 'Cele patru cadre și sintagma „martorul anonim”.', to: '3.1' },
    { n: 3, title: 'Răspunde la întrebări', desc: 'Cele 9 întrebări înainte de a porni.', to: '4.1' },
    { n: 4, title: 'Scrie povestea', desc: 'Atelierul de scris, cu contor de cuvinte.', to: '5.1',
      locked: 'Se deblochează după cele 9 întrebări' },
    { n: 5, title: 'Povestea mea', desc: 'Verifică, descarcă, printează.', to: '5.3',
      locked: 'Se deblochează după ce începi să scrii' }
  ]
};
