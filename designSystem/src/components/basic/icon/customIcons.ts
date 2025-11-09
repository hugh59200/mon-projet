import GoogleIcon from '@/assets/icons/GoogleIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import FacebookIcon from '@/assets/icons/FacebookIcon.vue'
import EmailIcon from '@/assets/icons/EmailIcon.vue'

export const customIcons = {
  google: GoogleIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
  email: EmailIcon,
}

export type CustomIconName = keyof typeof customIcons
