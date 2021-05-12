const fs = require("fs")
var chiffreTab = [1, 2, 3, 4, 5, 6, 7, 8, 9]

let nomFichier = process.argv[2]
if (!nomFichier) nomFichier = "s.txt"


function creerLignesAPartirdeFichier(nomFichier, nbInconnu) {
    try {
        let data = fs.readFileSync(nomFichier)
        let tabLigne = data.toString().split('\r\n')

        for (let i = 0; i < tabLigne.length; i++) {
            if (tabLigne[i] === '---+---+---') {
                tabLigne.splice(i, 1)
                i--
            }
            else {
                for (let j = 0; j < tabLigne[i].length; j++) {
                    if (tabLigne[i][j] === '|') {
                        let ligneTmp = tabLigne[i].split('')
                        ligneTmp.splice(j, 1)
                        tabLigne[i] = ligneTmp.join('')
                    } else if (tabLigne[i][j] === '_') nbInconnu++
                }
            }
        }
        return [tabLigne, nbInconnu]
    } catch (e) {
        console.log("Error: ", e.stack)
    }
}


function afficherSudokuAPartirdeTableauxLignes(tabLignes) {
    for (let i = 0; i < tabLignes.length; i++) {
        let txt = ''
        if (i % 3 === 0 && i > 0) {
            console.log('---+---+---')
        }
        for (let j = 0; j < tabLignes[i].length; j++) {
            if (j % 3 === 0 && j > 0) {
                txt += '|'
            }
            txt += tabLignes[i][j]
        }
        console.log(txt)
    }
    console.log('\n')
}


function ligneHas1Inconnu(ligne) {
    let bool = false
    ligne.split('').map(chiffre => {
        if (chiffre === '_') bool = !bool
    })
    return bool
}


function resoudreLigne1Inconnu(tabLignes, indiceLigne) {
    let ligne = tabLignes[indiceLigne].split('')
    let chiffreInconnuTab = chiffreTab.slice().map(chiffre => chiffre.toString())
    let indexInconnu

    for (let i = 0; i < ligne.length; i++) {
        let indexChiffre = chiffreInconnuTab.indexOf(ligne[i])
        if (indexChiffre !== -1) {
            chiffreInconnuTab.splice(indexChiffre, 1)
        }
        else {
            indexInconnu = i
        }
    }
    let chiffreInconnu = chiffreInconnuTab.join()
    ligne.splice(indexInconnu, 1, chiffreInconnu)
    tabLignes[indiceLigne] = ligne.join('')
}


function resoudreTableauxEnLigneAvec1Inconnu(table, nbInconnu) {
    for (let i = 0; i < table.length; i++) {
        if (ligneHas1Inconnu(table[i])) {
            resoudreLigne1Inconnu(table, i)
            nbInconnu--
        }
    }
    return nbInconnu
}


function creerColonnesAPartirdeLignesTableau(lignesTableau) {
    let tabColonne = []
    for (let j = 0; j < lignesTableau[0].length; j++) {
        let colonne = ''
        for (let i = 0; i < lignesTableau.length; i++) {
            colonne += lignesTableau[i][j]
        }
        tabColonne.push(colonne)
    }
    return tabColonne
}


function creerCarresAPartirdeLignesTableau(lignesTableau) {
    let tabCarre = []
    for (let i = 0; i < lignesTableau.length; i = i + 3) {
        for (let j = 0; j < lignesTableau[i].length; j = j + 3) {
            let carre = ''

            carre += lignesTableau[i][j]
            carre += lignesTableau[i][j + 1]
            carre += lignesTableau[i][j + 2]

            carre += lignesTableau[i + 1][j]
            carre += lignesTableau[i + 1][j + 1]
            carre += lignesTableau[i + 1][j + 2]

            carre += lignesTableau[i + 2][j]
            carre += lignesTableau[i + 2][j + 1]
            carre += lignesTableau[i + 2][j + 2]

            tabCarre.push(carre)
        }
    }
    return tabCarre
}


function afficherNbInconnu(nbInconnu) {
    console.log("nbInconnu: " + nbInconnu + '\n')
}


function resoudreSudoku(nomFichier) {
    var nbInconnu = 0

    var [lignesTableau, nbInconnu] = creerLignesAPartirdeFichier(nomFichier, nbInconnu)
    afficherNbInconnu(nbInconnu)
    console.log("Sudoku à remplir: ")
    afficherSudokuAPartirdeTableauxLignes(lignesTableau)


    let nbTour = 0
    while (nbInconnu > 0 && nbTour < 5) {

        nbInconnu = resoudreTableauxEnLigneAvec1Inconnu(lignesTableau, nbInconnu)

        let colonnesTableau = creerColonnesAPartirdeLignesTableau(lignesTableau)
        nbInconnu = resoudreTableauxEnLigneAvec1Inconnu(colonnesTableau, nbInconnu)

        lignesTableau = creerColonnesAPartirdeLignesTableau(colonnesTableau)
        let carresTableau = creerCarresAPartirdeLignesTableau(lignesTableau)
        nbInconnu = resoudreTableauxEnLigneAvec1Inconnu(carresTableau, nbInconnu)
        afficherNbInconnu(nbInconnu)

        lignesTableau = creerCarresAPartirdeLignesTableau(carresTableau)

        nbTour++
    }
    console.log("Sudoku fini: ")
    afficherSudokuAPartirdeTableauxLignes(lignesTableau)
}

resoudreSudoku(nomFichier)








// var tableau = [
//     [
//         [
//             [1, 9, 5],
//             [3, "_", 6],
//             [4, 7, 2]
//         ],
//         [
//             [7, 8, 4],
//             [5, 2, 9],
//             [1, "_", 3]
//         ],
//         [
//             [2, "_", "_"],
//             [1, 4, 7],
//             [9, 8, 5]
//         ]
//     ],
//     [
//         [
//             [6, 3, 7],
//             [8, 5, 9],
//             [2, 1, 4]
//         ],
//         [
//             [8, 5, 2],
//             [6, "_", 1],
//             [3, 9, 7]
//         ],
//         [
//             [4, 1, 9],
//             [7, 3, 2],
//             [6, 5, 8]
//         ]
//     ],
//     [
//         [
//             [9, 2, "_"],
//             [5, "_", 8],
//             [7, 6, 1]
//         ],
//         [
//             [4, 1, 8],
//             [9, 7, 6],
//             [2, 3, 5]
//         ],
//         [
//             [5, 7, 6],
//             [3, 2, 1],
//             [8, "_", 4]
//         ]
//     ]
// ]



// console.log("Ancienne table: ")
// afficherTableSudoku(tableau)

// var tabCarreAvec1Inconnu = renvoiTableauCoordonneesCarreAvec1Inconnu(tableau)

// tabCarreAvec1Inconnu.map(IndiceCarre => {
//     resoudreCarre1Inconnu(tableau, IndiceCarre)
//     // replace1InconnuDansCarre(tableau, carre, chiffreARemplacer)
// })


// console.log("\n\nNouvelle table: ")
// afficherTableSudoku(tableau)




/*
function afficherTableSudoku(tab) {
    tab.map((ligne, indexLigne) => {
        for (var ligneCarre = 0; ligneCarre < 3; ligneCarre++) {
            let txt = ''
            for (var carre = 0; carre < ligne.length; carre++) {
                tab[indexLigne][carre][ligneCarre].map(lettre => txt += lettre)
                if (carre < ligne.length - 1) txt += "|"
            }
            console.log(txt)
        }
        let txt = "---+---+---"
        console.log(txt)
    })
}
*/


/*
function replace1InconnuDansCarre(tableau, carre, chiffreARemplacer) {
    for (let i = 0; i < tableau[carre[0]][carre[1]].length; i++) {
        for (let j = 0; j < tableau[carre[0]][carre[1]][i].length; j++) {
            if (tableau[carre[0]][carre[1]][i][j] === "_") {
                tableau[carre[0]][carre[1]][i].splice(j, 1, chiffreARemplacer)
                return
            }
        }
    }
}
*/


/*
function renvoiTableauCoordonneesCarreAvec1Inconnu(tableau) {
    let tabCarreAvec1Inconnu = []
    for (let ligneTableau = 0; ligneTableau < tableau.length; ligneTableau++) {
        for (let carre = 0; carre < tableau[ligneTableau].length; carre++) {
            let inconnu = 0
            for (let ligneCarre = 0; ligneCarre < tableau[ligneTableau][carre].length; ligneCarre++) {
                for (let chiffreCarre = 0; chiffreCarre < tableau[ligneTableau][carre][ligneCarre].length; chiffreCarre++) {
                    if (tableau[ligneTableau][carre][ligneCarre][chiffreCarre] === "_") inconnu++
                }
            }
            if (inconnu === 1) {
                let indiceCarreAvec1Inconnu = [ligneTableau, carre]
                tabCarreAvec1Inconnu.push(indiceCarreAvec1Inconnu)
            }
        }
    }
    return tabCarreAvec1Inconnu
}
*/

// function resoudreCarre1Inconnu(tab, IndiceCarre) {
    //     let carre = tab[IndiceCarre[0]][IndiceCarre[1]]
    //     var chiffreInconnuTab = chiffreTab.slice()
    //     var indexInconnu
    //     for (let ligne = 0; ligne < carre.length; ligne++) {
    //         for (let colonne = 0; colonne < carre[ligne].length; colonne++) {
    //             let index = chiffreInconnuTab.indexOf(carre[ligne][colonne])
    //             if (index !== -1) {
    //                 chiffreInconnuTab.splice(index, 1)
    //             }
    //             else {
    //                 indexInconnu = [ligne, colonne]
    //             }
    //         }
    //     }
    //     var chiffreInconnu = parseInt(chiffreInconnuTab.join())
    //     tab[IndiceCarre[0]][IndiceCarre[1]][indexInconnu[0]].splice(indexInconnu[1], 1, chiffreInconnu)
    //     // return chiffreInconnu
    // }