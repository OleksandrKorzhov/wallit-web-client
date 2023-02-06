import {ICity, ICountry, IState} from "country-state-city";
import { stringUtils } from "../../common/utils";

export const getCityIdFromCityObject = (value: ICity) => stringUtils.normalize(
  `${value.name}/${value.countryCode}/${value.stateCode}/${value.latitude}/${value.longitude}`
);

export const getCountryId = (value: ICountry) => value.isoCode;

export const getStateId = (value: IState) => value.isoCode;
