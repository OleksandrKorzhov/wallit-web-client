import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {stringUtils} from "../../../../common/utils";
import {GeoOptionType, GeoOptionWithCustomValueType} from "../../types";
import {FilterOptionsState} from "@mui/material";

const filter = createFilterOptions<GeoOptionWithCustomValueType>();

type Props = {
  id: string;
  label: string;
  options?: GeoOptionType[];
  disabled?: boolean;
  value: GeoOptionType | null;
  onChange: (value: GeoOptionType | null) => void;
  customItemId: string;
};

export function GeoInput({label, id, options = [], disabled, value, onChange, customItemId}: Props) {
  console.log(value);

  return (
    <Autocomplete
      id={id}
      options={options}
      renderInput={(props) => <TextField label={label} {...props} />}
      disabled={disabled}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      value={value}
      onChange={(event, value: GeoOptionWithCustomValueType | string | null) => {
        if (typeof value === "string") {
          onChange({
            id: value,
            label: value,
          });
        } else if (value?.customValue) {
          onChange({
            ...value,
            label: value.customValue,
          });
        } else {
          onChange(value);
        }
      }}
      filterOptions={(options: Array<GeoOptionWithCustomValueType>, state: FilterOptionsState<GeoOptionWithCustomValueType>) => {
        const filtered = filter(options, state);

        const {inputValue} = state;
        const exist = options.some(option => stringUtils.includes(option.label, inputValue))
        if (inputValue !== "" && !exist) {
          filtered.push({
            id: customItemId,
            label: `Add: ${inputValue}`,
            customValue: inputValue,
          });
        }

        return filtered;
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
    />
  );
}
