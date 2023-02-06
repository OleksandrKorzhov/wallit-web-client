import {GeoInput} from "./common/GeoInput";
import {useMemo} from "react";
import {City, ICity} from "country-state-city";
import {GeoInputBaseProps} from "../types";
import {getCityIdFromCityObject} from "../utils";
import {CUSTOM_CITY_ID} from "../constants";

type Props = GeoInputBaseProps & {
  countryCode?: string;
  stateCode?: string;
};

export function CityInput({countryCode, stateCode, ...props}: Props) {
  const cityOptions = useMemo(() => {
    let cities: ICity[] | undefined = [];

    if (countryCode && stateCode) {
      cities = City.getCitiesOfState(countryCode, stateCode);
    } else if (countryCode) {
      cities = City.getCitiesOfCountry(countryCode);
    }

    if (!cities) {
      return [];
    }

    return cities.map((city: ICity) => ({
      id: getCityIdFromCityObject(city),
      label: city.name,
    }));
  }, [countryCode, stateCode]);

  return (
    <GeoInput
      options={cityOptions}
      disabled={!countryCode && !stateCode}
      customItemId={CUSTOM_CITY_ID}
      {...props}
    />
  )
}
