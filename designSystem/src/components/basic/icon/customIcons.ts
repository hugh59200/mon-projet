import GoogleIcon from '@/assets/icons/GoogleIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import FacebookIcon from '@/assets/icons/FacebookIcon.vue'

export const customIcons = {
  google: GoogleIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
}

export type CustomIconName = keyof typeof customIcons
