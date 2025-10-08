<h3 style="color: #c73b07;">Typographie</h4>

Dans notre système de design, les styles de texte et les polices sont gérés via des variables définies dans le fichier **global.less**.

<h5 style="color: #034366;">Variables de Polices et de Poids</h5>

Les polices et les poids des caractères sont définis de la manière suivante :

| Variable             | Valeur |
| -------------------- | ------ |
| font-family-primary  | 'mont' |
| font-weight-light    | 300    |
| font-weight-regular  | 600    |
| font-weight-semibold | 700    |
| font-weight-bold     | 800    |

<br>

<h5 style="color: #034366;">Tailles de Police</h5>

Les tailles de police sont définies pour différentes utilisations :

| Taille de Police  | Valeur |
| ----------------- | ------ |
| font-size-body-s  | 10px   |
| font-size-body-m  | 12px   |
| font-size-body-l  | 14px   |
| font-size-body-xl | 16px   |
| font-size-h5      | 18px   |
| font-size-h4      | 20px   |
| font-size-h3      | 28px   |
| font-size-h2      | 35px   |
| font-size-h1      | 48px   |

<br>

<h5 style="color: #034366;">Classes Utilitaires pour le Texte</h5>

Des classes utilitaires sont définies pour appliquer rapidement des styles de texte :

```
.text-h1 {
  font-size: font-size-h1;
}
.text-h2 {
  font-size: font-size-h2;
}
.text-h3 {
  font-size: font-size-h3;
}
.text-h4 {
  font-size: font-size-h4;
}
.text-h5 {
  font-size: font-size-h5;
}
.text-body-xl {
  font-size: font-size-body-xl;
}
.text-body-l {
  font-size: font-size-body-l;
}
.text-body-m {
  font-size: font-size-body-m;
}
.text-body-s {
  font-size: font-size-body-s;
}
```

<br>

<h6 style="color: #034366;">Poids du Texte</h6>

Des classes utilitaires sont également disponibles pour appliquer différents poids au texte :

```
.text-light {
  font-weight: font-weight-light;
}
.text-regular {
  font-weight: font-weight-regular;
}
.text-semibold {
  font-weight: font-weight-semibold;
}
.text-bold {
  font-weight: font-weight-bold;
}
```

<br>

<h6 style="color: #034366;">Styles de Titres et Paragraphes</h6>

Les styles pour les titres et les paragraphes sont définis comme suit :

```
h1 {
  font-size: font-size-h1;
  font-weight: font-weight-bold;
}

h2 {
  font-size: font-size-h2;
  font-weight: font-weight-semibold;
}

h3 {
  font-size: font-size-h3;
  font-weight: font-weight-semibold;
}

h4 {
  font-size: font-size-h4;
  font-weight: font-weight-regular;
}

h5 {
  font-size: font-size-h5;
  font-weight: font-weight-regular;
}

p {
  font-size: font-size-body-l;
  font-weight: font-weight-regular;
}
```

<br>

<h3 style="color: #c73b07;">Logique des Spacings</h4>

Dans notre système de design, les espacements sont gérés via des tokens définis dans le fichier `spacing_token.less`. Ces tokens permettent d'assurer une cohérence dans les marges et les paddings à travers toute l'application.
Les tokens d'espacement sont définis en pixels et suivent une échelle qui facilite la conception d'interfaces harmonieuses.

<h5 style="color: #034366;">Espacement générique :</h5>

| Token      | Valeur |
| ---------- | ------ |
| spacing-5  | 4px    |
| spacing-10 | 8px    |
| spacing-15 | 16px   |
| spacing-20 | 24px   |
| spacing-25 | 32px   |
| spacing-30 | 40px   |
| spacing-35 | 64px   |

<br>

<h5 style="color: #034366;">Espacement pour les boutons :</h5>

Pour les boutons, des espacements spécifiques sont définis pour les tailles différentes :

| Taille de Bouton | Espacement |
| ---------------- | ---------- |
| spacing-button-s | 30px       |
| spacing-button-m | 40px       |
| spacing-button-l | 48px       |

<br>

<h5 style="color: #034366;">Autres composants :</h5>

Des valeurs de padding spécifiques sont également définies pour différents types de composants :

| Composant      | Padding |
| -------------- | ------- |
| padding-button | 10px    |
| padding-tag-m  | 8px     |
| padding-tag-s  | 5px     |
| padding-alert  | 16px    |
