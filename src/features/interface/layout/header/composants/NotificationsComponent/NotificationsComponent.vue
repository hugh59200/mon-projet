<template>
  <div
    ref="notifications"
    id="notifications"
  >
    <div
      v-if="store.unreadNotificationsList?.data.length"
      class="pastille"
    ></div>
    <BasicButton
      type="reverse"
      iconName="notification"
      variant="outlined"
      size="medium"
      @click="showNotifications = !showNotifications"
    />
    <div
      class="notifications"
      ref="notifications"
      v-if="showNotifications"
    >
      <div class="notifications__header">
        <BasicText
          weight="bold"
          size="h5"
          color="secondary-900"
        >
          Notifications ({{
            listToggleId === 0 ? store.unreadNotificationsList?.totalRecords : store.allNotificationsList?.totalRecords
          }})
        </BasicText>
        <BasicToggleSwitch
          :modelValue="listToggleId"
          @update:model-value="(value: any) => (listToggleId = value)"
          size="small"
          :items="[
            { id: 0, label: 'Nouveau' },
            { id: 1, label: 'Voir tout' },
          ]"
        />
      </div>
      <div
        v-if="listToggleId === 0"
        class="notifications__list"
      >
        <div
          v-for="(elem, id) in store.unreadNotificationsList?.data"
          :key="id"
        >
          <div :class="`notifications__elem notifications__elem--${elem.type.toLocaleLowerCase()}`">
            <BasicIcon :name="IconMap[elem.type as NotificationTypeDTO]" />
            <div class="notifications__elem--content">
              <BasicText
                size="body-m"
                color="secondary-900"
              >
                {{ elem.message }}
              </BasicText>
              <BasicText
                size="body-s"
                color="secondary-600"
              >
                {{ moment(elem.lastModifiedDate).fromNow() }}
              </BasicText>
            </div>
            <BasicTooltip
              class="iconRight"
              label="Marquer comme lu"
              position="left"
            >
              <BasicIcon
                @click="changeNotificationStatut(elem.id, 'Read')"
                style="fill: black; transform: scale(0.6); cursor: pointer"
                name="tick-circle"
              />
            </BasicTooltip>
          </div>
        </div>
      </div>
      <div
        v-if="listToggleId === 1"
        class="notifications__list"
      >
        <div
          v-for="(elem, id) in store.allNotificationsList?.data"
          :key="id"
        >
          <div :class="`notifications__elem notifications__elem--${elem.type.toLocaleLowerCase()}`">
            <BasicIcon :name="IconMap[elem.type as NotificationTypeDTO]" />
            <div class="notifications__elem--content">
              <BasicText
                size="body-m"
                color="secondary-900"
              >
                {{ elem.message }}
              </BasicText>
              <BasicText
                size="body-s"
                color="secondary-600"
              >
                {{ moment(elem.lastModifiedDate).fromNow() }}
              </BasicText>
            </div>
            <BasicTooltip
              class="iconRight"
              :label="elem.statut === 'Read' ? 'Marquer comme à lire' : 'Marquer comme lu'"
              position="left"
            >
              <BasicIcon
                @click="changeNotificationStatut(elem.id, elem.statut === 'Read' ? 'Unread' : 'Read')"
                style="fill: black; transform: scale(0.6); cursor: pointer"
                :name="elem.statut === 'Read' ? 'notification' : 'tick-circle'"
              />
            </BasicTooltip>
          </div>
        </div>
      </div>
      <BasicText
        v-if="listToggleId === 0"
        class="notifications__footer"
        @click="store.unreadNotificationsList?.data.length ? markAllAs('Read') : null"
        size="body-m"
        color="white"
        :pointer="!!store.unreadNotificationsList?.data.length"
      >
        {{ store.unreadNotificationsList?.data.length ? 'Tout marquer comme lu' : 'Pas de notifications' }}
      </BasicText>
      <BasicText
        v-if="listToggleId === 1"
        class="notifications__footer"
        @click="store.allNotificationsList?.data.length ? markAllAs('Unread') : null"
        size="body-m"
        color="white"
        :pointer="!!store.allNotificationsList?.data.length"
      >
        {{ store.allNotificationsList?.data.length ? 'Tout marquer comme à lire' : 'Pas de notifications' }}
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import moment from 'moment/min/moment-with-locales'
  import { IconMap } from './Notifications.types'
  import type { NotificationTypeDTO } from '@/features/api/extranet/dto/Notification/NotificationTypeDTO'
  import type { NotificationStatutDTO } from '@/features/api/extranet/dto/Notification/NotificationStatutDTO'
  import type { NotificationPayloadDTO } from '@/features/api/extranet/dto/Notification/NotificationPayloadDTO'
  import { useNotificationsStore } from './useNotificationsStore'
  import { useDialog } from '@/features/interface/dialog'
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'

  const dialog = useDialog()
  const listToggleId = ref(0)
  const notifications = ref()
  const showNotifications = ref(false)
  const store = useNotificationsStore()

  const markAllAs = async (statut: NotificationStatutDTO) => {
    pauseClickOutside(async () => {
      const result = await dialog.showDialog({
        message: statut === 'Read' ? 'Voulez-vous tout marquer comme lu ?' : 'Voulez-vous tout marquer comme non-lu ?',
        type: 'YesNo',
        title: statut === 'Read' ? 'Tout marquer comme lu' : 'Tout marquer comme non-lu',
      })
      if (result === 'Yes') {
        store.markAllNotificationsAs(statut)
      }
    })
  }

  const changeNotificationStatut = async (id: number, statut: NotificationStatutDTO) => {
    const payload = {
      IdsNotification: [id],
      StatutTo: statut,
      statutsFrom: statut === 'Read' ? ['Unread'] : ['Read'],
    } as NotificationPayloadDTO

    store.changeSingleNotificationStatus(payload)
  }

  const { pauseClickOutside } = useHandleClickOutside(notifications, () => {
    showNotifications.value = false
  })
</script>

<style lang="less" scoped>
  @import './NotificationsComponent.less';
</style>
