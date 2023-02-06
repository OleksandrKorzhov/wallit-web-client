import {gql} from "../../../__generated__";
import {useQuery} from "@apollo/client";
import {useUserProfile} from "../../identity/hooks/useUserProfile";

const GET_LINKED_ACCOUNTS = gql(/* GraphQL */`
    query GetUserWithPlaidItems($userId: ID!) {
        node(id: $userId) {
            id
            ... on User {
                plaidItems {
                    institution {
                        name
                        accounts {
                            id
                            name
                            type
                            balanceAvailable
                            balanceCurrent
                            balanceIsoCurrencyCode
                        }
                    }
                }
            }
        }
    }
`);

export const useLinkedAccounts = () => {
  const [userProfile] = useUserProfile();
  return useQuery(GET_LINKED_ACCOUNTS, {
    variables: {
      userId: userProfile!.id,
    },
  });
}
