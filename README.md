# Distance de Levenshtein – Application Electron.js

Application desktop développée avec **Electron.js** et **Node.js** permettant de mesurer la similarité entre deux chaînes de caractères grâce à l’algorithme de distance de Levenshtein.

---

## 🚀 Installation & Lancement

Assurez-vous d’avoir **Node.js** installé.

```bash
npm install
node app.js
```

---

## 🧠 Algorithme – Distance de Levenshtein

La distance de Levenshtein correspond au nombre minimal d’opérations nécessaires pour transformer une chaîne en une autre.

Trois opérations sont possibles (coût = 1) :

- **Insertion** : ajouter un caractère  
- **Suppression** : retirer un caractère  
- **Substitution** : remplacer un caractère  

### Exemple

Transformer :

```text
"Ronald" → "Ronaldo"
```

Une seule opération est nécessaire :
- Insertion de `"o"`

La distance de Levenshtein est donc **1**.

---

## ⚙️ Paramétrage

L’application permet d’ajuster un **seuil de tolérance** afin d’obtenir des résultats plus stricts ou plus larges selon le niveau de similarité souhaité (ex. comparaison de tags ou recherche approximative).