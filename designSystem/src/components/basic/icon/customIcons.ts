import GoogleIcon from '@/assets/icons/GoogleIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import FacebookIcon from '@/assets/icons/FacebookIcon.vue'
import EmailIcon from '@/assets/icons/EmailIcon.vue'
import FastPeptidesLogo from '@/assets/icons/FastPeptidesLogo.vue'
import FlagFR from '@/assets/icons/FlagFR.vue'
import FlagEN from '@/assets/icons/FlagEN.vue'
import FlagDE from '@/assets/icons/FlagDE.vue'

export const customIcons = {
  google: GoogleIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
  email: EmailIcon,
  fastPeptides: FastPeptidesLogo,
  flagFR: FlagFR,
  flagEN: FlagEN,
  flagDE: FlagDE,
}

export type CustomIconName = keyof typeof customIcons
