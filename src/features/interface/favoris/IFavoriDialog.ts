import type { RouteName } from '@/router/route-name.ts'

export interface IFavoriDialog {
  showDialog(routeName: RouteName): Promise<string>
}

