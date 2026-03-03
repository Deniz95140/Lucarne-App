const input = document.querySelector('#search-input') as HTMLInputElement;
const result = document.querySelector('#result-list')!;
const form = document.getElementById('formulaire') as HTMLFormElement;
const sortByPopularityCheckbox = document.querySelector('#cbx-46') as HTMLInputElement;
const searchByTagsCheckbox = document.querySelector('#cbx-46-2') as HTMLInputElement;

let players: any[] = [];

// Charger les données des joueurs
fetch('data.json')
    .then(blob => blob.json())
    .then(data => {
        players.push(...data.player);
    });


// Algorithmes pour mesurer la similarité entre deux caractère
function distanceLevenshtein(a: string, b: string): number {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const m: number = a.length;
    const n: number = b.length;

    if (m === 0) return n;
    if (n === 0) return m;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost: number = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // Suppression
                dp[i][j - 1] + 1, // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return dp[m][n];
}

// Fonction pour rechercher des joueurs
function trouverJoueur(recherche: string, players: any[]): any[] {
    const rechercheLower = recherche.toLowerCase(); // Recherche insensible à la casse
    const seuilDistance = Math.max(1, Math.floor(recherche.length / 4)); // Tolérance stricte

    // Recherche et traitement
    let joueursFiltres = players
        .map(player => {
            // Récupérer les champs à comparer en fonction de l'option de recherche
            const champs = searchByTagsCheckbox.checked
                ? [
                    ...player.tags.map((tag: string) => tag.toLowerCase()),
                    player.pays.toLowerCase(),
                    player.clubs.toLowerCase()
                ]
                : [player.nom.toLowerCase()];

            // Vérifier les correspondances par sous-chaîne
            const sousChaineMatch = champs.some(champ => champ.includes(rechercheLower));

            if (sousChaineMatch) {
                return { player, distance: -1 }; // Correspondance parfaite (priorité maximale)
            }

            // Calculer les distances Levenshtein pour chaque champ
            const distances = champs.map(champ => distanceLevenshtein(rechercheLower, champ));
            const minDistance = Math.min(...distances);

            return { player, distance: minDistance };
        })
        // Filtrer les joueurs selon la distance Levenshtein ou les correspondances parfaites
        .filter(({ distance }) => distance <= seuilDistance || distance === -1);

    // Appliquer le tri en fonction de la case cochée
    if (sortByPopularityCheckbox.checked) {
        joueursFiltres = joueursFiltres.sort(
            (a, b) => a.distance - b.distance || b.player.popularite - a.player.popularite
        );
    } else {
        joueursFiltres = joueursFiltres.sort(
            (a, b) => a.distance - b.distance || a.player.nom.localeCompare(b.player.nom)
        );
    }

    // Retourner uniquement les joueurs après tri
    return joueursFiltres.map(({ player }) => player);
}


// Fonction pour afficher les résultats
function afficherResultat() {
    if (input.value.length > 0) {
        let tabResult = trouverJoueur(input.value, players);

        if (sortByPopularityCheckbox.checked) {
            tabResult = tabResult.sort((a, b) => b.popularite - a.popularite);
        }

        const resultHTML = tabResult.map(player => {
            return `
                <style>
                li:hover {
                    background-color: #3b3b3b;
                    border-radius: 5px;
                }
                </style>

                <li class="d-flex align-items-center justify-content-between result" style="height: 70px; padding: 0 10px;">
                    <div class="d-flex align-items-center text-decoration-none text-dark w-100" style="height: 70px; cursor: pointer;">
                        <div class="d-flex align-items-center" style="flex-grow: 1;">
                            <img src='${player.pays_img}' alt='${player.pays}' style="width: 50px; height: 70px; object-fit: contain; filter: invert(0); margin-right: 10px;"/>
                            <img src='${player.club_img}' alt='${player.clubs}' style="width: 45px; height: 45px; object-fit: contain; filter: invert(0); margin-right: 10px;"/>
                            <img src='${player.img}' alt='${player.nom}' style="width: 50px; height: 70px; object-fit: cover; filter: invert(0); margin-right: 10px;"/>
                            <span class="d-block overflow-hidden text-nowrap text-truncate text-light">${player.nom}</span>
                        </div>
                        <div style="text-align: right;">
                            <span class="text-light">${player.popularite}</span>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
        result.innerHTML = resultHTML;

        if (tabResult.length === 0 && input.value.length > 0) {
            const errHTML = `<li class="d-flex align-items-center justify-content-center text-white text-center fst-italic fw-bold" style="height: 70px; padding: 0 10px;">
                            <p>Aucun joueur trouvé...</p>
                        </li>`;
            result.innerHTML = errHTML;
        }
    } else {
        result.innerHTML = "";
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
});

input.addEventListener('input', afficherResultat);
sortByPopularityCheckbox.addEventListener('change', afficherResultat);
searchByTagsCheckbox.addEventListener('change', afficherResultat);
afficherResultat();