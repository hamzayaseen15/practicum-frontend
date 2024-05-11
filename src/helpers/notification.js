import { NOTIFICATION_MODEL_LINKS } from '@src/constants'

export const getNotificationLink = (notification) => {
  if (!notification?.model) return '#'

  const notificationLink = NOTIFICATION_MODEL_LINKS[notification.model]

  return `/${notificationLink.route}/${notification.modelId}/${notificationLink.path}`
}
