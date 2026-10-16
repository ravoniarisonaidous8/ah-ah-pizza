# Oh! La! La Pizza's — proposition de site

Site vitrine React + TypeScript + Vite. Les données métier du prototype sont centralisées dans
`src/config/site.ts` ; le calcul du panier et la création du message WhatsApp se trouvent dans
`src/lib/cart.ts`.

## Démarrer

```bash
npm install
npm run dev
```

Vérifications disponibles :

```bash
npm run build
npm test
```

## Avant toute publication

Les données suivantes sont des exemples ou doivent être confirmées par le propriétaire :

- Le menu, les noms des produits, compositions, formats, suppléments et tous les prix.
- L'horaire de fermeture annoncé à 22 h, ainsi que les autres horaires.
- L'adresse et l'emplacement exact. Le site ouvre une recherche Google Maps et ne revendique pas
  d'épingle vérifiée.
- L'autorisation de recevoir des demandes via WhatsApp. Le prototype ne confirme jamais une commande.
- Le texte de présentation et l'histoire réelle de l'établissement.
- Les éventuels liens de réseaux sociaux.
- Les photographies. Les images actuelles sont des visuels d'illustration hébergés par Unsplash,
  pas des photos du restaurant. La [licence Unsplash](https://unsplash.com/license) autorise
  l'utilisation gratuite, y compris commerciale, sous réserve de ses restrictions ; vérifiez chaque
  visuel retenu et, de préférence, remplacez-les par des images que l'établissement est autorisé à publier.

Dans `src/config/site.ts`, remplacez les produits d'exemple et leurs visuels, puis mettez leur
propriété `isExample` à `false`. Passez `demoMode` à `false` seulement quand le contenu public est
prêt. Ne passez `pricesVerified` à `true` qu'après vérification de chaque prix : les prix et le total
seront alors inclus dans le message WhatsApp. Passez `onlineOrderingEnabled` à `true` uniquement
après autorisation explicite du propriétaire. Le message reste une demande à confirmer par la
pizzeria, jamais une confirmation automatique.

La carte reste volontairement une recherche Maps tant que `locationVerified` est `false`. Après
vérification de l'emplacement exact, le propriétaire peut renseigner `mapsEmbedUrl` et activer cette
option pour afficher la carte intégrée.

Les cartes de produits de démonstration portent une mention visible « exemple » et les montants
actuels sont fictifs. Remplacez les produits dans `menuProducts`, les photos dans la configuration,
et le texte de présentation avant lancement. Aucun avis, note client, horaire complet ou service de
livraison n'est inventé ou affiché.
