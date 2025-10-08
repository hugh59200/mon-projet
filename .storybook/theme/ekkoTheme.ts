import { create } from '@storybook/theming'

//  https://storybook.js.org/docs/configure/user-interface/theming
export default create({
  base: 'light',
  brandTitle: 'EKKO',
  brandUrl: 'https://extranet-dev.akto.fr/',
  brandImage: './ekko_logo.png',

  colorPrimary: '#00a79b',
  colorSecondary: '#20b2ba',

  appBg: '#bfc7d1', // couleur de la bar latéral
  appContentBg: '#eaecef', // couleur du contenu principal
  appBorderColor: '#20b2ba', // couleur secondaire

  textColor: '#000000', // noir pour le texte
  textInverseColor: '#ffffff',

  barTextColor: '#20b2ba', // Utilisez votre couleur secondaire
  barSelectedColor: '#00a79b', // Utilisez une autre nuance de votre couleur primaire
  barBg: '#bfc7d1', // Utilisez une couleur neutre
})
