import type { InjectionKey, Ref } from 'vue'

export type TabsModel = string | number | null | undefined

export const BasicTabsKey = Symbol() as InjectionKey<BasicTabsProvided>

export type BasicTabsProvided = {
  selectedTab: Ref<TabsModel>
  change: (value: TabsModel) => void
}
