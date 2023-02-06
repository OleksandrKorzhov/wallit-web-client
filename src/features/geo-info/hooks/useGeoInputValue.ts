import {useState} from "react";
import {GeoOptionType} from "../types";

export const useGeoInputValue = () => {
  return useState<GeoOptionType | null>(null);
}
