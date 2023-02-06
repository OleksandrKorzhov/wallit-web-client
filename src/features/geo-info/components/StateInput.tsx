import {GeoInput} from "./common/GeoInput";
import {useMemo} from "react";
import {IState, State} from "country-state-city";
import {GeoInputBaseProps} from "../types";
import {CUSTOM_STATE_ID} from "../constants";

type Props = GeoInputBaseProps & {
  countryCode?: string;
};

export function StateInput({countryCode, ...props}: Props) {
  const stateOptions = useMemo(() => {
    let states: IState[] | undefined = [];

    if (countryCode) {
      states = State.getStatesOfCountry(countryCode);
    }

    if (!states) {
      return []
    }

    return states.map((state: IState) => ({
      id: state.isoCode,
      label: state.name,
    }));
  }, [countryCode]);

  return (
    <GeoInput
      disabled={!countryCode}
      options={stateOptions}
      customItemId={CUSTOM_STATE_ID}
      {...props}
    />
  );
}
