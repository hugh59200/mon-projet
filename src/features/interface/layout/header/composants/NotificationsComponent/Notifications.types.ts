import type { NotificationTypeDTO } from "@/features/api/extranet/dto/Notification/NotificationTypeDTO"
export type NotificationIconName = 'info-circle' | 'danger' | 'folder'

export const IconMap: Record<NotificationTypeDTO, NotificationIconName> = {
  Message: 'info-circle',
  Alerte: 'danger',
  Rappel: 'folder'
}
