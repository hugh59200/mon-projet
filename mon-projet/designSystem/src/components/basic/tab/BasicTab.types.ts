import type { TabsModel } from '../tabs/BasicTabs.types'

export type TabState = 'success' | 'danger'

export type TabProps = {
  tabKey: TabsModel
  tabState?: TabState
}
