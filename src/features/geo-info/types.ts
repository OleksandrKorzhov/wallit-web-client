import {ComponentProps} from "react";
import {GeoInput} from "./components/common/GeoInput";
import {UserHomeLocation} from "../identity/types";

export type GeoOptionType = {
  id: string;
  label: string;
};

export type GeoOptionWithCustomValueType = GeoOptionType & {
  customValue?: string;
};

export type GeoInputBaseProps = Pick<ComponentProps<typeof GeoInput>, "id" | "label" | "value" | "onChange">;

export type UseGeoValuesParams = {
  defaultValues?: Partial<UserHomeLocation>;
}
