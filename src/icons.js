// ===== icons.js — Registre des 20 icônes SVG inline =====
// Pas de fetch() : tout est inline pour compatibilité file://

window.BUILTIN_ICONS = {
  poisson: {
    name: 'Poisson',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><ellipse cx="36" cy="40" rx="24" ry="16"/><polygon points="58,40 76,24 76,56"/><circle cx="24" cy="35" r="4" fill="white"/><circle cx="23" cy="34" r="2" fill="#1a1a2e"/><path d="M30,24 Q36,12 42,24"/><path d="M32,56 Q36,64 42,56"/><path d="M12,38 Q14,42 12,44" stroke="white" stroke-width="2" fill="none"/></svg>'
  },
  silhouette: {
    name: 'Silhouette',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="22" r="14"/><path d="M26,18 Q28,6 40,8 Q52,6 54,18"/><path d="M16,80 Q16,50 26,42 Q32,38 40,36 Q48,38 54,42 Q64,50 64,80 Z"/><path d="M34,36 L40,48 L46,36" fill="white" opacity=".3"/><rect x="58" y="52" width="4" height="14" rx="2"/><circle cx="60" cy="50" r="4"/></svg>'
  },
  pokeball: {
    name: 'Pokéball',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M4,40 A36,36 0 0,1 76,40 Z"/><path d="M4,40 A36,36 0 0,0 76,40 Z" opacity=".6"/><rect x="4" y="37" width="72" height="6"/><circle cx="40" cy="40" r="12"/><circle cx="40" cy="40" r="7" fill="white"/><circle cx="40" cy="40" r="3"/></svg>'
  },
  dragonball: {
    name: 'Dragon Ball',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="36"/><polygon points="40,14 42,20 48,20 43,24 45,30 40,26 35,30 37,24 32,20 38,20" fill="white" opacity=".9"/><polygon points="28,30 30,36 36,36 31,40 33,46 28,42 23,46 25,40 20,36 26,36" fill="white" opacity=".9"/><polygon points="52,30 54,36 60,36 55,40 57,46 52,42 47,46 49,40 44,36 50,36" fill="white" opacity=".9"/><polygon points="40,44 42,50 48,50 43,54 45,60 40,56 35,60 37,54 32,50 38,50" fill="white" opacity=".9"/><ellipse cx="28" cy="24" rx="6" ry="4" fill="white" opacity=".2" transform="rotate(-30 28 24)"/></svg>'
  },
  epee: {
    name: 'Épée',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><rect x="37" y="4" width="6" height="44" rx="1"/><polygon points="37,4 40,0 43,4"/><rect x="24" y="48" width="32" height="6" rx="3"/><rect x="36" y="54" width="8" height="16" rx="2"/><circle cx="40" cy="74" r="5"/></svg>'
  },
  manette: {
    name: 'Manette',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M12,34 Q12,24 22,24 L58,24 Q68,24 68,34 L68,46 Q68,62 56,62 L50,62 Q46,62 44,56 L36,56 Q34,62 30,62 L24,62 Q12,62 12,46 Z"/><rect x="22" y="38" width="14" height="5" rx="1" fill="white" opacity=".3"/><rect x="27" y="33" width="5" height="14" rx="1" fill="white" opacity=".3"/><circle cx="52" cy="36" r="3" fill="white" opacity=".3"/><circle cx="58" cy="42" r="3" fill="white" opacity=".3"/><circle cx="52" cy="48" r="3" fill="white" opacity=".3"/><circle cx="46" cy="42" r="3" fill="white" opacity=".3"/></svg>'
  },
  etoile: {
    name: 'Étoile',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M40 4L48.5 28.5H74L53 44.5L61 70L40 54L19 70L27 44.5L6 28.5H31.5Z"/></svg>'
  },
  feuille: {
    name: 'Feuille',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M40,4 C56,4 72,18 72,40 C72,58 56,72 40,72 C28,72 18,64 14,52 L8,76 L4,74 L12,46 C10,42 8,36 8,30 C8,14 22,4 40,4Z"/><path d="M40,14 L40,62" stroke="white" stroke-width="2" opacity=".3" fill="none"/><path d="M40,24 L28,18" stroke="white" stroke-width="1.5" opacity=".25" fill="none"/><path d="M40,32 L26,28" stroke="white" stroke-width="1.5" opacity=".25" fill="none"/><path d="M40,40 L28,38" stroke="white" stroke-width="1.5" opacity=".25" fill="none"/><path d="M40,24 L52,18" stroke="white" stroke-width="1.5" opacity=".25" fill="none"/><path d="M40,32 L54,28" stroke="white" stroke-width="1.5" opacity=".25" fill="none"/><path d="M40,40 L52,38" stroke="white" stroke-width="1.5" opacity=".25" fill="none"/></svg>'
  },
  loupe: {
    name: 'Loupe',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="34" cy="34" r="22" opacity=".9"/><circle cx="34" cy="34" r="15" fill="white" opacity=".25"/><rect x="50" y="48" width="10" height="26" rx="4" transform="rotate(-45 50 48)"/><ellipse cx="28" cy="28" rx="6" ry="4" fill="white" opacity=".15" transform="rotate(-30 28 28)"/></svg>'
  },
  trophee: {
    name: 'Trophée',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M22,10 L58,10 L56,40 Q54,52 40,54 Q26,52 24,40 Z"/><path d="M22,10 Q8,12 10,26 Q12,36 22,34" opacity=".7"/><path d="M58,10 Q72,12 70,26 Q68,36 58,34" opacity=".7"/><rect x="36" y="54" width="8" height="10" rx="2"/><rect x="26" y="64" width="28" height="6" rx="3"/><ellipse cx="40" cy="28" rx="8" ry="5" fill="white" opacity=".15"/></svg>'
  },
  coeur: {
    name: 'Coeur',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M40,72 L12,42 Q0,28 12,16 Q24,4 40,20 Q56,4 68,16 Q80,28 68,42 Z"/><ellipse cx="26" cy="26" rx="8" ry="6" fill="white" opacity=".15" transform="rotate(-20 26 26)"/></svg>'
  },
  globe: {
    name: 'Globe',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="36"/><ellipse cx="40" cy="40" rx="14" ry="36" fill="none" stroke="white" stroke-width="2" opacity=".25"/><line x1="4" y1="28" x2="76" y2="28" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="4" y1="52" x2="76" y2="52" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="40" y1="4" x2="40" y2="76" stroke="white" stroke-width="1.5" opacity=".2"/><ellipse cx="32" cy="22" rx="8" ry="5" fill="white" opacity=".1" transform="rotate(-15 32 22)"/></svg>'
  },
  fusee: {
    name: 'Fusée',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M40,4 Q52,16 52,36 L52,50 L28,50 L28,36 Q28,16 40,4Z"/><rect x="30" y="50" width="20" height="8" rx="2"/><polygon points="28,38 18,54 28,50" opacity=".7"/><polygon points="52,38 62,54 52,50" opacity=".7"/><circle cx="40" cy="30" r="6" fill="white" opacity=".3"/><polygon points="34,58 40,72 46,58" opacity=".8"/><polygon points="36,58 40,68 44,58" fill="white" opacity=".2"/></svg>'
  },
  livre: {
    name: 'Livre',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M40,18 L40,70 Q28,64 10,64 L10,14 Q28,14 40,18Z" opacity=".85"/><path d="M40,18 L40,70 Q52,64 70,64 L70,14 Q52,14 40,18Z"/><path d="M40,18 Q28,14 10,14 L10,10 Q28,8 40,14 Q52,8 70,10 L70,14 Q52,14 40,18Z" opacity=".6"/><line x1="18" y1="28" x2="34" y2="30" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="18" y1="36" x2="34" y2="38" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="18" y1="44" x2="34" y2="46" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="46" y1="30" x2="62" y2="28" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="46" y1="38" x2="62" y2="36" stroke="white" stroke-width="1.5" opacity=".2"/><line x1="46" y1="46" x2="62" y2="44" stroke="white" stroke-width="1.5" opacity=".2"/></svg>'
  },
  couronne: {
    name: 'Couronne',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M8,56 L8,28 L22,40 L40,16 L58,40 L72,28 L72,56 Z"/><rect x="8" y="56" width="64" height="8" rx="3"/><circle cx="8" cy="28" r="4" opacity=".7"/><circle cx="40" cy="16" r="4" opacity=".7"/><circle cx="72" cy="28" r="4" opacity=".7"/><circle cx="22" cy="40" r="3" opacity=".5"/><circle cx="58" cy="40" r="3" opacity=".5"/><ellipse cx="40" cy="44" rx="12" ry="4" fill="white" opacity=".1"/></svg>'
  },
  musique: {
    name: 'Musique',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><ellipse cx="22" cy="62" rx="12" ry="9"/><ellipse cx="62" cy="54" rx="12" ry="9"/><rect x="31" y="10" width="5" height="52"/><rect x="71" y="6" width="5" height="48"/><rect x="31" y="6" width="45" height="10" rx="2"/><rect x="31" y="6" width="45" height="5" opacity=".6"/></svg>'
  },
  eclair: {
    name: 'Éclair',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><polygon points="46,2 20,42 36,42 28,78 62,34 44,34"/><polygon points="46,2 20,42 36,42 34,50 50,26 44,34 62,34 46,18" fill="white" opacity=".12"/></svg>'
  },
  camera: {
    name: 'Caméra',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><rect x="6" y="24" width="54" height="40" rx="6"/><polygon points="60,34 76,24 76,64 60,54"/><circle cx="33" cy="44" r="12" fill="white" opacity=".2"/><circle cx="33" cy="44" r="7" fill="white" opacity=".15"/><circle cx="14" cy="32" r="3" opacity=".6"/></svg>'
  },
  ballon: {
    name: 'Ballon',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="36"/><path d="M40,4 Q46,20 40,40 Q34,60 40,76" fill="none" stroke="white" stroke-width="2" opacity=".25"/><path d="M6,30 Q24,38 40,32 Q56,26 74,30" fill="none" stroke="white" stroke-width="2" opacity=".25"/><path d="M6,52 Q24,44 40,50 Q56,56 74,50" fill="none" stroke="white" stroke-width="2" opacity=".25"/><path d="M14,14 Q28,28 20,44 Q14,58 18,70" fill="none" stroke="white" stroke-width="1.5" opacity=".2"/><path d="M66,14 Q52,28 60,44 Q66,58 62,70" fill="none" stroke="white" stroke-width="1.5" opacity=".2"/></svg>'
  },
  atome: {
    name: 'Atome',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="7"/><ellipse cx="40" cy="40" rx="34" ry="12" fill="none" stroke="currentColor" stroke-width="3" opacity=".7"/><ellipse cx="40" cy="40" rx="34" ry="12" fill="none" stroke="currentColor" stroke-width="3" opacity=".7" transform="rotate(60 40 40)"/><ellipse cx="40" cy="40" rx="34" ry="12" fill="none" stroke="currentColor" stroke-width="3" opacity=".7" transform="rotate(120 40 40)"/><circle cx="74" cy="40" r="4" opacity=".6"/><circle cx="23" cy="59" r="4" opacity=".6"/><circle cx="57" cy="21" r="4" opacity=".6"/></svg>'
  },
  play: {
    name: 'Play',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="36" opacity=".2"/><polygon points="28,18 28,62 66,40"/><polygon points="28,18 28,26 54,40 28,54 28,62 66,40" fill="white" opacity=".15"/></svg>'
  },
  tete_de_mort: {
    name: 'Tête de mort',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><path d="M40 4C22 4 10 18 10 34c0 10 5 18 12 22v8c0 2 2 4 4 4h4v6c0 1 1 2 2 2h4c1 0 2-1 2-2v-6h4v6c0 1 1 2 2 2h4c1 0 2-1 2-2v-6h4c2 0 4-2 4-4v-8c7-4 12-12 12-22C70 18 58 4 40 4z"/><ellipse cx="29" cy="32" rx="8" ry="9" fill="white"/><ellipse cx="51" cy="32" rx="8" ry="9" fill="white"/><circle cx="29" cy="33" r="5"/><circle cx="51" cy="33" r="5"/><path d="M34 48c0 0 3 4 6 4s6-4 6-4" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="36" cy="44" r="1.5" fill="white"/><circle cx="44" cy="44" r="1.5" fill="white"/></svg>'
  },
  drapeau_arrivee: {
    name: 'Drapeau arrivée',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor"><rect x="14" y="8" width="6" height="64" rx="2"/><rect x="20" y="8" width="46" height="36" rx="2"/><rect x="20" y="8" width="11" height="9" fill="white"/><rect x="42" y="8" width="12" height="9" fill="white"/><rect x="31" y="17" width="11" height="9" fill="white"/><rect x="54" y="17" width="12" height="9" fill="white"/><rect x="20" y="26" width="11" height="9" fill="white"/><rect x="42" y="26" width="12" height="9" fill="white"/><rect x="31" y="35" width="11" height="9" fill="white"/><rect x="54" y="35" width="12" height="9" fill="white"/></svg>'
  }
};

window.ICON_ORDER = [
  'poisson','silhouette','pokeball','dragonball','epee','manette','etoile',
  'feuille','loupe','trophee','coeur','globe','fusee','livre','couronne',
  'musique','eclair','camera','ballon','atome',
  'play','tete_de_mort','drapeau_arrivee'
];
