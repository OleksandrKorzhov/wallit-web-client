import {NotificationItemType} from "../../../common/types";
import {useEffect} from "react";
import {isAfter, parseISO} from "date-fns";
import {queryUtils} from "../../../common/utils";
import {notificationsVar} from "../state";
import {useGetNotificationsQuery, useSubscribeToNotifications} from "../queries";
import {DiscountOffer, Notification} from "../../../__generated__/graphql";

export const useNotificationsController = () => {
  const unreadNotificationsQuery = useGetNotificationsQuery();
  // const newNotificationsSubscription = useSubscribeToNotifications();

  useEffect(() => {
    const receivedNotifications: NotificationItemType[] = []

    if (!queryUtils.isLoadingOrError(unreadNotificationsQuery) && unreadNotificationsQuery.data?.notifications.__typename === "NotificationConnection") {
      for (const notification of unreadNotificationsQuery.data.notifications.edges || []) {
        if (notification?.node?.__typename !== "Notification") {
          continue;
        }

        receivedNotifications.push({
          id: notification.node.id,
          type: notification.node.type,
          checkedInApp: notification.node.checkedInApp,
          notificationDiscountOffer: notification.node.notificationDiscountOffer?.__typename === "DiscountOffer"
            ? {
              ...notification.node.notificationDiscountOffer,
              expiresAt: parseISO(notification.node.notificationDiscountOffer.expiresAt),
              createdAt: parseISO(notification.node.notificationDiscountOffer.createdAt),
            }
            : undefined,
        } as NotificationItemType);
      }
    }

    notificationsVar(receivedNotifications);
  }, [unreadNotificationsQuery]);

  // useEffect(() => {
  //   if (newNotificationsSubscription.loading || newNotificationsSubscription.error || newNotificationsSubscription.data?.notification?.__typename !== "Notification") {
  //     return;
  //   }
  //
  //   const newNotification = newNotificationsSubscription.data.notification as Notification;
  //   const offer = newNotification.notificationDiscountOffer as DiscountOffer | undefined;
  //
  //   if (offer?.__typename === "DiscountOffer" && isAfter(new Date(), parseISO(offer.expiresAt))) {
  //     return;
  //   }
  //
  //   notificationsVar([
  //     {
  //       ...newNotification,
  //       notificationDiscountOffer: offer?.__typename === "DiscountOffer"
  //         ? {
  //           ...offer,
  //           expiresAt: parseISO(offer.expiresAt),
  //           createdAt: parseISO(offer.createdAt),
  //         }
  //         : undefined,
  //     } as NotificationItemType,
  //     ...notificationsVar(),
  //   ]);
  // }, [newNotificationsSubscription])
};
