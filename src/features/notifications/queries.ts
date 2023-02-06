import {gql} from "../../__generated__";
import {useUserProfile} from "../identity/hooks/useUserProfile";
import {useLazyQuery, useSubscription} from "@apollo/client";
import {useEffect, useMemo} from "react";

const GET_NOTIFICATIONS = gql(/*GraphQL*/`
    query GetUserUnreadNotifications($userId: ID!, $currentTime: Time) {
        notifications(
            where: {
                checkedInApp: false,
                or: [
                    {hasNotificationDiscountOffer: false},
                    {
                        hasNotificationDiscountOfferWith: {
                            expiresAtGT: $currentTime
                        }
                    }
                ],
                hasNotificationRecipientWith: {id: $userId}
            },
            orderBy: {field: CREATED_AT, direction: DESC}
        ) {
            edges {
                node {
                    id
                    type
                    checkedInApp
                    notificationDiscountOffer {
                        id
                        amount
                        type
                        merchantSpecificIdentification
                        createdAt
                        expiresAt
                        ownerMerchant {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`);

const SUBSCRIBE_TO_NOTIFICATIONS = gql(/*GraphQL*/`
    subscription SubscribeToNewNotifications($userId: ID!) {
        notification(ownerID: $userId) {
            id
            type
            checkedInApp
            createdAt
            #            notificationRecipient {
            #                id
            #                identityProviderID
            #            }
            notificationDiscountOffer {
                id
                amount
                type
                merchantSpecificIdentification
                createdAt
                expiresAt
                ownerMerchant {
                    id
                    name
                }
            }
        }
    }
`);

export const useGetNotificationsQuery = () => {
  const [userProfile] = useUserProfile();

  /**
   * The poll interval ins used instead of subscription because of the following
   *
   * 1. It is recommended approach by the Apollo team
   * 2. Notifications must be independent of other entities that creates additional difficulty in implementing them
   * 3. Considering the above the area of notifications usage narrows to something that is:
   *    - independent of other entities
   *    - requires realtime communication
   */

  const [run, state] = useLazyQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "cache-and-network",
    pollInterval: 60 * 1000,
  });

  useEffect(() => {
    run({
      variables: {
        userId: userProfile!.id,
        currentTime: new Date().toISOString(),
      },
    })
  }, []);

  return useMemo(() => state, [state]);
}

export const useSubscribeToNotifications = () => {
  const [userProfile] = useUserProfile();

  return useSubscription(SUBSCRIBE_TO_NOTIFICATIONS, {
    variables: { userId: userProfile!.id },
    // shouldResubscribe: true,
  });
}
