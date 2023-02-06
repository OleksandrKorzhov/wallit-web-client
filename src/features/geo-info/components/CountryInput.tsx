import {Country, ICountry} from "country-state-city";
import {GeoInput} from "./common/GeoInput";
import {GeoInputBaseProps} from "../types";
import {CUSTOM_COUNTRY_ID} from "../constants";

const countries = Country.getAllCountries().map((country: ICountry) => ({
  id: country.isoCode,
  label: country.name,
}));

type Props = GeoInputBaseProps;

export function CountryInput(props: Props) {
  return (
    <GeoInput
      options={countries}
      customItemId={CUSTOM_COUNTRY_ID}
      {...props}
    />
  );
}
