import {useSpendingCategories} from "../../../settings/hooks/useSpendingCategories";
import {SpendingCategoriesFormControl} from "../../../settings/components/SpendingCategoriesFormControl";
import Stack from "@mui/material/Stack";
import {LoadingButton} from "@mui/lab";
import {queryUtils} from "../../../../common/utils";
import {InProgressPlaceholder} from "../../../../common/components/placeholders/InProgressPlaceholder";
import {ErrorPlaceholder} from "../../../../common/components/placeholders/ErrorPlaceholder";

export function SpendingCategoriesStep({onComplete}: { onComplete: () => void }) {
  const spendingCategories = useSpendingCategories();

  const handleSave = async () => {
    const result = await spendingCategories.save();

    if (result.error) {
      return;
    }

    onComplete();
  }

  if (queryUtils.isLoading(spendingCategories.query)) {
    return <InProgressPlaceholder/>;
  }

  if (queryUtils.isError(spendingCategories.query)) {
    return <ErrorPlaceholder/>;
  }

  return (
    <Stack width="100%" gap={10} alignItems="center">
      <SpendingCategoriesFormControl {...spendingCategories} />

      <LoadingButton variant="contained" onClick={handleSave}>
        Save
      </LoadingButton>
    </Stack>
  );
}
