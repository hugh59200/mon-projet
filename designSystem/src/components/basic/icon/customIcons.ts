import GoogleIcon from '@/assets/icons/GoogleIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import FacebookIcon from '@/assets/icons/FacebookIcon.vue'
import EmailIcon from '@/assets/icons/EmailIcon.vue'
import FastPeptidesLogo from '@/assets/icons/FastPeptidesLogo.vue'
import FlagFR from '@/assets/icons/FlagFR.vue'
import FlagEN from '@/assets/icons/FlagEN.vue'
import StripeIcon from '@/assets/icons/StripeIcon.vue'
import PaymentVisa from '@/assets/icons/PaymentVisa.vue'
import PaymentMastercard from '@/assets/icons/PaymentMastercard.vue'
import PaymentAmex from '@/assets/icons/PaymentAmex.vue'
import PaypalIcon from '@/assets/icons/PaypalIcon.vue'
import TwitterIcon from '@/assets/icons/TwitterIcon.vue'
import LinkedinIcon from '@/assets/icons/LinkedinIcon.vue'
import InstagramIcon from '@/assets/icons/InstagramIcon.vue'
import YoutubeIcon from '@/assets/icons/YoutubeIcon.vue'
import MoleculeIcon from '@/assets/icons/MoleculeIcon.vue'
import MoleculeCtaIcon from '@/assets/icons/MoleculeCtaIcon.vue'

export const customIcons = {
  google: GoogleIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
  email: EmailIcon,
  fastPeptides: FastPeptidesLogo,
  flagFR: FlagFR,
  flagEN: FlagEN,
  stripe: StripeIcon,
  visa: PaymentVisa,
  mastercard: PaymentMastercard,
  amex: PaymentAmex,
  paypal: PaypalIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  molecule: MoleculeIcon,
  moleculeCta: MoleculeCtaIcon,
}

export type CustomIconName = keyof typeof customIcons
