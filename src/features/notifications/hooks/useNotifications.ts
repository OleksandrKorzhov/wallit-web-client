import {gql} from "../../../__generated__";
import {MutationResult, useMutation, useReactiveVar} from "@apollo/client";
import {useSnackbar} from "notistack";
import {notificationsVar} from "../state";
import {useCallback, useMemo} from "react";
import {NotificationItemType} from "../../../common/types";
import {useGetNotificationsQuery} from "../queries";
import {useNavigate} from "react-router-dom";
import config from "../../../config";
import {pathUtils, stringUtils} from "../../../common/utils";
import {NotificationType} from "../../../__generated__/graphql";

const MARK_AS_CHECKED = gql(/*GraphQL*/`
    mutation MarkNotificationAsCheckedInApp($ids: [ID!]!) {
        markNotificationsAsCheckedInApp(ids: $ids)
    }
`);

export const useNotifications = (): [NotificationItemType[], { check: (id: string) => any; checkState: MutationResult }] => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const notifications = useReactiveVar(notificationsVar);

  const [markAsChecked, markAsCheckedState] = useMutation(MARK_AS_CHECKED, {
    ignoreResults: true,
  });
  const unreadNotificationsQuery = useGetNotificationsQuery();

  const markNotificationAsChecked = useCallback(async (id: string) => {
    const result = await markAsChecked({
      variables: {ids: [id]},
    });

    if (result.errors) {
      return enqueueSnackbar("Some background error happened. The app should not be affected...", {
        variant: "warning",
      });
    }

    const copiedNotification = [...notificationsVar()];
    const targetNotificationIdx = copiedNotification.findIndex(notif => stringUtils.equals(notif.id, id))
    const [targetNotification] = copiedNotification.splice(targetNotificationIdx, 1);

    notificationsVar(copiedNotification);
    unreadNotificationsQuery.refetch();

    if (targetNotification?.type === NotificationType.Offer && targetNotification?.notificationDiscountOffer) {
      const offerPath = pathUtils.templateToPath(config.routing.offers(), {
        id: targetNotification.notificationDiscountOffer.id,
      });

      navigate(offerPath);

      return;
    }

    if (targetNotification?.type === NotificationType.Insights) {
      const path = config.routing.dashboard();

      navigate(path);
    }
  }, [markAsChecked, enqueueSnackbar, navigate, unreadNotificationsQuery]);

  return useMemo(() => [
    notifications,
    {
      check: markNotificationAsChecked,
      checkState: markAsCheckedState,
    }
  ], [notifications, markNotificationAsChecked, markAsCheckedState]);
}
