import { computed, shallowRef, watch } from 'vue'
import { defineStore } from 'pinia'
import type { FavorisDTO } from '@/features/api/extranet/dto/Favori'
import type { IFavoriDialog } from './IFavoriDialog'
import { useFavoriDialogStore } from './favoriDialogStore'
import { useFavorisApi } from '@/features/services/favoris/FavorisServices'
import { useAppStateStore } from '@/features/application'
import type { RouteName } from '@/router/route-name.ts'
import { type RouteLocationRaw, useRouter } from 'vue-router'

export const useFavorisStore = defineStore('favoris', () => {
  const storeDialog: IFavoriDialog = useFavoriDialogStore()
  const appState = useAppStateStore()
  const router = useRouter()

  const favorisApi = useFavorisApi<FavorisDTO[]>('quick-access')

  const canLoad = computed(() => {
    return appState.estUtilisateurAuthentifie && appState.estAuthentificationEnCours === false
  })

  const favoris = shallowRef<FavorisDTO[] | null>(null)

  async function loadFavoris() {
    if (canLoad.value) {
      const loadedFavoris = ((await favorisApi.loadFavoris()) ?? []) as FavorisDTO[]
      favoris.value = loadedFavoris.filter((item) => item.routeName)
    } else {
      favoris.value = null
    }
  }

  watch(canLoad, loadFavoris)

  async function deleteFavori(key: string) {
    const newFavoris = favoris.value?.filter((item) => item.key !== key) ?? []

    try {
      await favorisApi.saveFavoris(newFavoris)
    } catch {
      return
    }

    favoris.value = newFavoris
  }

  async function addFavori() {
    const route = router.currentRoute.value

    if (typeof route.name !== 'string') throw new Error('La route doit avoir un nom')

    const title = await storeDialog.showDialog(route.name as RouteName)

    const { pageNumber, pageSize, ...query } = route.query

    const location: RouteLocationRaw = {
      name: route.name as RouteName,
      params: route.params,
      query,
    }

    const item: FavorisDTO = {
      key: new Date().toISOString(),
      title,
      routeName: location.name as RouteName,
      to: location,
    }

    const newFavoris = [...favoris.value!, item]
    try {
      await favorisApi.saveFavoris(newFavoris)
      // Maj state
      favoris.value = newFavoris
    } catch {
      // Rien à faire
    }
  }

  function navigateToFavori(key: string) {
    // Obtient le favori
    const favoriSelectionnné = favoris.value?.filter((item) => item.key === key).at(0)
    if (!favoriSelectionnné) return

    /*
    // Obtient le helper de navigation selon le type. A refactoriser
    const { loadPageWithPagedRequest } = injectLoadRechercheService(favoriSelectionnné.type, 'DossierFormation')
    // Ouvre la page via le Helper
    loadPageWithPagedRequest(favoriSelectionnné.request)
    */

    router.push(favoriSelectionnné.to)
  }

  return {
    favoris,
    loadFavoris,
    deleteFavori,
    addFavori,
    navigateToFavori,
  }
})
