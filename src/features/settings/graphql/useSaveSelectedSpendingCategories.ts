import {useMutation} from "@apollo/client";
import {gql} from "../../../__generated__";

const SAVE_SELECTED_CATEGORIES = gql(/*GraphQL*/`
    mutation SaveSpendingCategoriesPreferences($userId: ID!, $selectedCategories: [ID!]!) {
        setSpendingCategories(userID: $userId, spendingCategoryIDs: $selectedCategories) {
            spendingCategories {
                id
                name
            }
        }
    }
`);

export const useSaveSelectedSpendingCategories = () => {
  return useMutation(SAVE_SELECTED_CATEGORIES, {
    ignoreResults: true,
  });
}
