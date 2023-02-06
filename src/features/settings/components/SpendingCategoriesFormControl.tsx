import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {useMemo} from "react";
import keyBy from "lodash/keyBy";
import {SpendingCategoryItemType} from "../../../common/types";

type Props = {
  onChange: (event: SelectChangeEvent<string[]>) => void;
  value: string[];
  totalSpendingCategories: SpendingCategoryItemType[];
};

export function SpendingCategoriesFormControl({onChange, value, totalSpendingCategories}: Props) {
  const totalSpendingCategoriesHash = useMemo(() => {
    return keyBy(totalSpendingCategories, "id")
  }, [totalSpendingCategories]);

  return (
    <FormControl fullWidth>
      <InputLabel id="spending-categories-select">Spending categories</InputLabel>
      <Select
        id="spending-categories-select"
        label="Spending categories"
        onChange={onChange}
        value={value}
        multiple
        renderValue={(selected: string[]) => (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {selected.map(item => (
              <Chip key={item} label={totalSpendingCategoriesHash[item]?.name}/>
            ))}
          </Stack>
        )}
      >
        {
          totalSpendingCategories.map(category => (
            <MenuItem key={category.id} selected={value.includes(category.id)} value={category.id}>
              {category.name}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}
