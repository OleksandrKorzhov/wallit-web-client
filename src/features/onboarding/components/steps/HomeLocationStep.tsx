import {useUserHomeLocation} from "../../../geo-info/hooks/useUserHomeLocation";
import Stack from "@mui/material/Stack";
import CottageIcon from "@mui/icons-material/Cottage";
import {CountryInput} from "../../../geo-info/components/CountryInput";
import {StateInput} from "../../../geo-info/components/StateInput";
import {CityInput} from "../../../geo-info/components/CityInput";
import {LoadingButton} from "@mui/lab";
import React from "react";
import {OnboardingStepContent} from "../common/OnboardingStepContent";

export function HomeLocationStep({onComplete}: { onComplete: () => void }) {
  const {
    country,
    state,
    city,
    onCountryChange,
    onStateChange,
    onCityChange,
    hasChanges,
    valid,
    save,
    saveState,
  } = useUserHomeLocation();

  const handleSave = async () => {
    const {error} = await save();

    if (error) {
      return;
    }

    onComplete();
  }

  return (
    <OnboardingStepContent
      icon={CottageIcon}
      text="Tell Wallit about your home location. It is important to comply with various data protection regulations so Wallit can enjoy warm sun rather than prison interior."
      action={(
        <>
          <Stack width="100%" gap={1} mb={5}>
            <CountryInput id="onboarding-home-country" label="Home country" value={country} onChange={onCountryChange}/>

            <StateInput
              id="onboarding-home-state"
              label="Home state"
              value={state}
              onChange={onStateChange}
              countryCode={country?.id}
            />

            <CityInput
              id="onboarding-home-city"
              label="Home city"
              value={city}
              onChange={onCityChange}
              countryCode={country?.id}
              stateCode={state?.id}
            />
          </Stack>

          <LoadingButton
            variant="contained"
            fullWidth
            onClick={handleSave}
            loading={saveState.loading}
            disabled={!valid || !hasChanges}
          >
            Save
          </LoadingButton>
        </>
      )}
    />
  );
}
