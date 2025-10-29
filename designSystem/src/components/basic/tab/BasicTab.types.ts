import type { RouteName } from '@/router/route-name'
import type { IconNameNext } from '../icon/BasicIconNext.vue'
import type { TabsModel } from '../tabs/BasicTabs.types'

export type TabProps = {
  /** Nom de route unique (clé logique) */
  routeName: RouteName

  /** Libellé lisible affiché dans l’onglet */
  tabKey: TabsModel

  /** Icône optionnelle associée à l’onglet */
  tabState?: IconNameNext

  /** Couleur de l’icône ou de l’onglet */
  color?: string
}
