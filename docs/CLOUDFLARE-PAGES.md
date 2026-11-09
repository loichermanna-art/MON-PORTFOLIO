# Déploiement sur Cloudflare Pages

Le portfolio est une application Vite statique. Le dépôt est prêt pour un
projet Pages connecté à GitHub ; aucun serveur ni variable secrète n'est requis.

1. Dans Cloudflare, ouvrir **Workers & Pages**, créer une application **Pages**
   et choisir la connexion à GitHub. Autoriser l'accès au dépôt
   `loichermanna-art/MON-PORTFOLIO` si nécessaire.
2. Choisir un nom disponible : il déterminera l'adresse `nom.pages.dev`.
3. Configurer le build :
   - Branche de production : `arena/e825c7df-mon-portfolio` (branche actuelle).
   - Répertoire racine : `/` (racine du dépôt).
   - Commande de build : `npm run build`.
   - Répertoire de sortie : `dist`.
   - Node.js : version 22, indiquée par `.node-version`.
4. Lancer le déploiement et attendre qu'il réussisse. Vérifier le site à
   l'adresse `pages.dev` attribuée par Cloudflare, la navigation 3D, les images
   et les liens de projets, sur ordinateur et mobile.

Cloudflare Pages applique son comportement SPA par défaut : en l'absence d'un
`404.html` à la racine de la sortie, les chemins de navigation retournent
`index.html`. Les règles de cache de `public/_headers` sont copiées dans `dist`
par Vite. Les fichiers dont le nom n'est pas haché ont un cache court pour que
les modifications apparaissent après déploiement.

Le site Vercel reste en place pendant la transition : ne le supprimer qu'après
validation du site Cloudflare. Les futurs changements sur la branche de
production configurée déclencheront les builds Pages. Si la branche de
production change ultérieurement, la mettre à jour dans les paramètres Pages.
