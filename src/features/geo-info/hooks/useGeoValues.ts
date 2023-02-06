import {useGeoInputValue} from "./useGeoInputValue";
import {GeoOptionType, UseGeoValuesParams} from "../types";
import {useEffect, useState} from "react";
// @TODO: move the library out of the bundle - probably into a web service
import {City, Country, ICity, ICountry, IState, State} from "country-state-city";
import {getCityIdFromCityObject} from "../utils";
import { stringUtils } from "../../../common/utils";
import {CUSTOM_CITY_ID, CUSTOM_COUNTRY_ID, CUSTOM_STATE_ID} from "../constants";

export const useGeoValues = (params?: UseGeoValuesParams) => {
  const [country, onCountryChange] = useGeoInputValue();
  const [state, onStateChange] = useGeoInputValue();
  const [city, onCityChange] = useGeoInputValue();
  const [hasChanges, setHasChanges] = useState(false);

  const onCountryChangeProxy = (value: GeoOptionType | null) => {
    onCountryChange(value);
    onStateChange(null);
    onCityChange(null);

    setHasChanges(true);
  };

  const onStateChangeProxy = (value: GeoOptionType | null) => {
    onStateChange(value);
    onCityChange(null);

    setHasChanges(true);
  }

  const onCityChangeProxy = (value: GeoOptionType | null) => {
    onCityChange(value);

    setHasChanges(true);
  }

  useEffect(() => {
    if (!params?.defaultValues) {
      return;
    }

    let fullCountry: ICountry | undefined;
    let fullState: IState | undefined;

    if (params.defaultValues.homeCountry) {
      fullCountry = Country.getCountryByCode(params.defaultValues.homeCountry);

      if (fullCountry) {
        onCountryChange({
          id: fullCountry?.isoCode,
          label: fullCountry.name,
        });
      } else {
        onCountryChange({
          id: CUSTOM_COUNTRY_ID,
          label: params.defaultValues.homeCountry,
        })
      }
    }

    if (params.defaultValues.homeState) {
      fullState = State.getStateByCodeAndCountry(params.defaultValues.homeState, fullCountry?.isoCode ?? "")

      if (fullState) {
        onStateChange({
          id: fullState.isoCode,
          label: fullState.name,
        });
      } else {
        onStateChange({
          id: CUSTOM_STATE_ID,
          label: params.defaultValues.homeState,
        });
      }
    }

    if (params.defaultValues.homeCity) {
      const cities = City.getCitiesOfState(fullCountry?.isoCode ?? "", fullState?.isoCode ?? "");
      const fullCity = cities.find((city: ICity) => stringUtils.equals(city.name, params.defaultValues?.homeCity))

      if (fullCity) {
        onCityChange({
          id: getCityIdFromCityObject(fullCity),
          label: fullCity.name,
        });
      } else {
        onCityChange({
          id: CUSTOM_CITY_ID,
          label: params.defaultValues.homeCity,
        });
      }
    }
  }, [params]);

  const reset = (field?: "all" | "edit-state") => {
    switch (field) {
      case "edit-state":
        setHasChanges(false);
        break;

      case "all":
      default:
        onCountryChange(null);
        onStateChange(null);
        onCityChange(null);
        setHasChanges(false);
    }
  };

  return {
    country,
    state,
    city,
    onCountryChange: onCountryChangeProxy,
    onStateChange: onStateChangeProxy,
    onCityChange: onCityChangeProxy,
    hasChanges,
    valid: Boolean(country?.id && state?.id && city?.id),
    reset,
  }
}
