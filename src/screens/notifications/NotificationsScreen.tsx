import {PageBase} from "../../common/components/layout/PageBase";
import List from "@mui/material/List";
import {NotificationType} from "../../__generated__/graphql";
import {NotFoundPlaceholder} from "../../common/components/placeholders/NotFoundPlaceholder";
import {InsightNotification} from "../../features/notifications/components/InsightNotification";
import {OfferNotification} from "../../features/notifications/components/OfferNotification";
import {useNotifications} from "../../features/notifications/hooks/useNotifications";

export function NotificationsScreen() {
  const [
    notifications,
    {
      check: handleNotificationOpen,
    }
  ] = useNotifications();

  return (
    <PageBase>
      {
        notifications.length ? (
          <List>
            {
              notifications.map(notification =>
                notification.type === NotificationType.Insights
                  ? (
                    <InsightNotification
                      key={notification.id}
                      id={notification.id}
                      onOpen={handleNotificationOpen}
                    />
                  ) : notification.type === NotificationType.Offer
                    ? (
                      <OfferNotification
                        key={notification.id}
                        id={notification.id}
                        expiresAt={notification.notificationDiscountOffer!.expiresAt}
                        onOpen={handleNotificationOpen}
                      />
                    ) : null
              )
            }
          </List>
        ) : (
          <NotFoundPlaceholder>
            No unread notifications
          </NotFoundPlaceholder>
        )
      }
    </PageBase>
  )
}
