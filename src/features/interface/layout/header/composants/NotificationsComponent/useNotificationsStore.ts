import * as services from '@/features/services/notifications/NotificationsService'
import { defineStore } from 'pinia'
import { shallowRef, watch, computed } from 'vue'
import { useAppStateStore } from '@/features/application'
import type { NotificationsDTO } from '@/features/api/extranet/dto/Notification/NotificationsDTO'
import type { NotificationStatutDTO } from '@/features/api/extranet/dto/Notification/NotificationStatutDTO';
import type { NotificationPayloadDTO } from '@/features/api/extranet/dto/Notification/NotificationPayloadDTO';
const timerInterval = parseInt(import.meta.env.VITE_NOTIFICATIONS_TIMER ?? 300000)

export const useNotificationsStore = defineStore('notifications', () => {
  const unreadNotificationsList = shallowRef<NotificationsDTO | null>(null)
  const allNotificationsList = shallowRef<NotificationsDTO | null>(null)
  const appState = useAppStateStore()

  const canLoad = computed(() => {
    return appState.estUtilisateurAuthentifie && appState.estAuthentificationEnCours === false
  })

  async function loadNotifications(withSablierAndDialog: boolean) {
    if (canLoad.value && document.visibilityState === 'visible') {
      allNotificationsList.value = await services.loadAllNotifications(withSablierAndDialog)
      unreadNotificationsList.value = await services.loadUnreadNotifications(withSablierAndDialog)
    } else {
      allNotificationsList.value = null
      unreadNotificationsList.value = null
    }
  }

  watch(() => `${canLoad.value}_${appState.contextCourant}`, () => {
    loadNotifications(true)
  }, { immediate: true })

  setInterval(() => {
    loadNotifications(false)
  }, timerInterval);

  async function changeSingleNotificationStatus(payload: NotificationPayloadDTO) {
    try {
      await services.changeSingleNotificationStatus(payload)
      loadNotifications(true)
    } catch {
      // console.log("Could not change notification status")
    }
  }

  async function markAllNotificationsAs(statut: NotificationStatutDTO) {
    try {
      await services.markAllNotificationsAs(statut)
      loadNotifications(true)
    } catch {
      // console.log("Could not change all notifications status at once")
    }
  }

  return {
    allNotificationsList,
    unreadNotificationsList,
    changeSingleNotificationStatus,
    markAllNotificationsAs
  }
})
