import GoogleIcon from '@/assets/icons/GoogleIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import FacebookIcon from '@/assets/icons/FacebookIcon.vue'
import EmailIcon from '@/assets/icons/EmailIcon.vue'
import FastPeptidesLogo from '@/assets/icons/FastPeptidesLogo.vue'

export const customIcons = {
  google: GoogleIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
  email: EmailIcon,
  fastPeptides: FastPeptidesLogo,
}

export type CustomIconName = keyof typeof customIcons
