import {useQuery} from "@apollo/client";
import {useUserProfile} from "../../identity/hooks/useUserProfile";
import {gql} from "../../../__generated__";

const GET_USER_SETTINGS = gql(/*GraphQL*/`
    query GetUserSettings($userId: ID!) {
        spendingCategories(where: {hasInterestedUsersWith: {id: $userId}}) {
            edges {
                node {
                    id
                    name
                }
            }
        }
        totalSpendingCategories: spendingCategories {
            edges {
                node {
                    id
                    name
                }
            }
        }
        notificationChannels(where: {hasChanelUsersWith: {id: $userId}}) {
            edges {
                node {
                    chanel
                }
            }
        }
        offerFrequency: node(id: $userId) {
            id
            ... on User {
                offerFrequency
            }
        }
    }
`);

export const useUserSettings = () => {
  const [userProfile] = useUserProfile();
  return useQuery(GET_USER_SETTINGS, {
    variables: {userId: userProfile!.id},
    fetchPolicy: "cache-and-network",
  });
}
