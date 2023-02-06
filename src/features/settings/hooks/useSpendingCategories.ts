import {useMemo, useState} from "react";
import {SpendingCategoryItemType} from "../../../common/types";
import {arrayUtils, queryUtils } from "../../../common/utils";
import {useUserSettings} from "../graphql/useUserSettings";
import {useSaveSelectedSpendingCategories} from "../graphql/useSaveSelectedSpendingCategories";
import {useUserProfile} from "../../identity/hooks/useUserProfile";
import {useSnackbar} from "notistack";
import {SelectChangeEvent} from "@mui/material/Select";

export const useSpendingCategories = () => {
  const [userProfile] = useUserProfile();
  const userSettingsQueryState = useUserSettings();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saveMutation, saveMutationState] = useSaveSelectedSpendingCategories();
  const {enqueueSnackbar} = useSnackbar();

  const savedSpendingCategories = useMemo(() => {
    const spendingCategories: SpendingCategoryItemType[] = [];
    const spendingCategoryIds: string[] = [];

    if (queryUtils.isLoadingOrError(userSettingsQueryState) || userSettingsQueryState.data?.spendingCategories.__typename !== "SpendingCategoryConnection") {
      return spendingCategories;
    }

    for (const category of userSettingsQueryState.data.spendingCategories.edges || []) {
      if (category?.node?.__typename !== "SpendingCategory") {
        continue;
      }

      spendingCategoryIds.push(category.node.id);
      spendingCategories.push({
        id: category.node.id,
        name: category.node.name,
      });
    }

    setSelectedCategories(spendingCategoryIds);

    return spendingCategories;
  }, [userSettingsQueryState]);

  const totalSpendingCategories = useMemo(() => {
    const totalSpendingCategories: SpendingCategoryItemType[] = [];

    if (queryUtils.isLoadingOrError(userSettingsQueryState) || userSettingsQueryState.data?.totalSpendingCategories.__typename !== "SpendingCategoryConnection") {
      return totalSpendingCategories;
    }

    for (const category of userSettingsQueryState.data.totalSpendingCategories.edges || []) {
      if (category?.node?.__typename !== "SpendingCategory") {
        continue;
      }

      totalSpendingCategories.push({
        id: category.node.id,
        name: category.node.name,
      });
    }

    return totalSpendingCategories;
  }, [userSettingsQueryState]);

  const onChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;

    setSelectedCategories(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSaveSpendingCategoriesPreferences = async () => {
    const settingsUpdateResult = await saveMutation({
      variables: {
        userId: userProfile!.id,
        selectedCategories: selectedCategories,
      },
    });

    if (settingsUpdateResult.errors) {
      enqueueSnackbar("Some error happened during settings update. Please try again in a minute", {
        variant: "error",
      });

      return {
        error: true,
      }
    }

    await userSettingsQueryState.refetch();

    return {
      error: false,
    }
  };

  return useMemo(() => ({
    query: userSettingsQueryState,
    value: selectedCategories,
    onChange,
    savedSpendingCategories,
    totalSpendingCategories,
    save: handleSaveSpendingCategoriesPreferences,
    saveState: saveMutationState,
    hasChanges: arrayUtils.notEqual(selectedCategories, savedSpendingCategories.map(c => c.id)),
  }), [
    userSettingsQueryState,
    selectedCategories,
    onChange,
    savedSpendingCategories,
    totalSpendingCategories,
    handleSaveSpendingCategoriesPreferences,
    saveMutationState,
  ]);
}
