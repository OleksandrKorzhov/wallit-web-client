import {gql} from "../../__generated__";
import {AsyncOperationState} from "../../common/components/async-operation-state/AsyncOperationState";
import {PageBase} from "../../common/components/layout/PageBase";
import {useMutation, useQuery} from "@apollo/client";
import Stack from "@mui/material/Stack";
import {ChangeEvent, useMemo, useState} from "react";
import {queryUtils} from "../../common/utils";
import {SpendingCategoryItemType} from "../../common/types";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {useUserProfile} from "../../features/identity/hooks/useUserProfile";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import {SettingsBock} from "../../features/settings/components/SettingsBock";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import keyBy from "lodash/keyBy";
import {useSnackbar} from "notistack";
import {UserNotificationChannelPreferencesChanel, UserOfferFrequency} from "../../__generated__/graphql";
import Radio from "@mui/material/Radio";
import {CountryInput} from "../../features/geo-info/components/CountryInput";
import {CityInput} from "../../features/geo-info/components/CityInput";
import {StateInput} from "../../features/geo-info/components/StateInput";
import {useUserHomeLocation} from "../../features/geo-info/hooks/useUserHomeLocation";
import {useUserSettings} from "../../features/settings/graphql/useUserSettings";
import {useSaveSelectedSpendingCategories} from "../../features/settings/graphql/useSaveSelectedSpendingCategories";
import {SpendingCategoriesFormControl} from "../../features/settings/components/SpendingCategoriesFormControl";
import {useSpendingCategories} from "../../features/settings/hooks/useSpendingCategories";

// const GET_USER_SETTINGS = gql(/*GraphQL*/`
//     query GetUserSettings($userId: ID!) {
//         spendingCategories(where: {hasInterestedUsersWith: {id: $userId}}) {
//             edges {
//                 node {
//                     id
//                     name
//                 }
//             }
//         }
//         totalSpendingCategories: spendingCategories {
//             edges {
//                 node {
//                     id
//                     name
//                 }
//             }
//         }
//         notificationChannels(where: {hasChanelUsersWith: {id: $userId}}) {
//             edges {
//                 node {
//                     chanel
//                 }
//             }
//         }
//         offerFrequency: node(id: $userId) {
//             id
//             ... on User {
//                 offerFrequency
//             }
//         }
//     }
// `);

// const SAVE_SELECTED_CATEGORIES = gql(/*GraphQL*/`
//     mutation SaveSpendingCategoriesPreferences($userId: ID!, $selectedCategories: [ID!]!) {
//         setSpendingCategories(userID: $userId, spendingCategoryIDs: $selectedCategories) {
//             spendingCategories {
//                 id
//                 name
//             }
//         }
//     }
// `);

const SAVE_NOTIFICATION_CHANNEL_PREFERENCES = gql(/*GraphQL*/`
    mutation SaveNotificationChannelPreferences($userId: ID!, $notificationChannels: [UserNotificationChannelPreferencesChanel!]!) {
        setNotificationChannels(userID: $userId, notificationChannel: $notificationChannels) {
            notificationChannels {
                chanel
            }
        }
    }
`);

const SAVE_OFFER_FREQUENCY_PREFERENCES = gql(/*GraphQL*/`
    mutation SaveOfferFrequencyPreferences($userId: ID!, $frequency: UserOfferFrequency!) {
        setOfferFrequency(userID: $userId, frequency: $frequency) {
            offerFrequency
        }
    }
`);

export function SettingsScreen() {
  const [userProfile] = useUserProfile();
  const userSettingsQueryState = useUserSettings();
  const [saveNotificationChannelsPreferences, saveNotificationChannelsPreferencesState] = useMutation(SAVE_NOTIFICATION_CHANNEL_PREFERENCES, {
    ignoreResults: true,
  });
  const [saveOfferFrequency, saveOfferFrequencyState] = useMutation(SAVE_OFFER_FREQUENCY_PREFERENCES, {
    ignoreResults: true,
  });

  const {enqueueSnackbar} = useSnackbar();

  const [selectedNotificationMethods, setSelectedNotificationMethods] = useState<string[]>([]);
  const [selectedOfferFrequency, setSelectedOfferFrequency] = useState<UserOfferFrequency>(UserOfferFrequency.AssSoonAsPossible);
  const {
    country,
    state,
    city,
    onCountryChange,
    onStateChange,
    onCityChange,
    hasChanges: locationSettingsChanged,
    valid: locationSettingsValid,
    save: saveHomeLocation,
    saveState: saveHomeLocationState,
  } = useUserHomeLocation();
  const spendingCategories = useSpendingCategories();

  const notificationChannels = useMemo(() => {
    const notificationChannels: string[] = [];

    if (queryUtils.isLoadingOrError(userSettingsQueryState) || userSettingsQueryState.data?.notificationChannels.__typename !== "UserNotificationChannelPreferencesConnection") {
      return notificationChannels;
    }

    for (const chanel of userSettingsQueryState.data.notificationChannels.edges || []) {
      if (chanel?.node?.__typename !== "UserNotificationChannelPreferences") {
        continue;
      }

      notificationChannels.push(chanel.node.chanel);
    }

    setSelectedNotificationMethods(notificationChannels);

    return notificationChannels;
  }, [userSettingsQueryState]);

  const offerFrequency = useMemo(() => {
    let offerFrequency: UserOfferFrequency = UserOfferFrequency.AssSoonAsPossible;

    if (!queryUtils.isLoadingOrError(userSettingsQueryState) && userSettingsQueryState.data?.offerFrequency?.__typename === "User") {
      offerFrequency = userSettingsQueryState.data.offerFrequency.offerFrequency;
    }

    setSelectedOfferFrequency(offerFrequency);

    return offerFrequency;
  }, [userSettingsQueryState]);

  const handleNotificationMethodsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSelectedNotificationMethods(selectedMethods => {
      const arr = [...selectedMethods];
      const valueIndex = selectedMethods.indexOf(value);

      if (valueIndex > -1) {
        arr.splice(valueIndex, 1);
      } else {
        arr.push(value);
      }

      return [...arr];
    });
  }

  const handleOfferFrequencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOfferFrequency(event.target.value as UserOfferFrequency);
  }

  const handleSaveNotificationPreferences = async () => {
    const result = await saveNotificationChannelsPreferences({
      variables: {
        userId: userProfile!.id,
        notificationChannels: selectedNotificationMethods as UserNotificationChannelPreferencesChanel[],
      },
    });

    if (result.errors) {
      return enqueueSnackbar("Some error happened during settings update. Please try again in a minute", {
        variant: "error",
      });
    }

    userSettingsQueryState.refetch();
  };

  const handleSaveOrderFrequencyPreferences = async () => {
    const result = await saveOfferFrequency({
      variables: { userId: userProfile!.id, frequency: selectedOfferFrequency },
    });

    if (result.errors) {
      return enqueueSnackbar("Some error happened during settings update. Please try again in a minute", {
        variant: "error",
      });
    }

    userSettingsQueryState.refetch();
  };

  return (
    <AsyncOperationState
      component={PageBase}
      operation={userSettingsQueryState}
      sx={{minHeight: "100%", justifyContent: "space-between"}}
    >
      <>
        <SettingsBock
          title="Home location"
          text="Please tell about the location you call home"
          allowSaveChanges={locationSettingsChanged && locationSettingsValid}
          onSave={saveHomeLocation}
          saveInProgress={saveHomeLocationState.loading}
        >
          <Stack gap={2}>
            <CountryInput id="home-country-select" label="Home country" value={country} onChange={onCountryChange} />

            <StateInput
              id="home-state-select"
              label="Home state"
              value={state}
              onChange={onStateChange}
              countryCode={country?.id}
            />

            <CityInput
              id="home-city-select"
              label="Home city"
              value={city}
              onChange={onCityChange}
              countryCode={country?.id}
              stateCode={state?.id}
            />
          </Stack>
        </SettingsBock>

        <Box my={4}/>

        <SettingsBock
          title="Spending categories"
          text="Please chose spending categories that you are interested in. Wallit will use this information to get the most testy discount offers for you ;)"
          allowSaveChanges={spendingCategories.hasChanges}
          onSave={spendingCategories.save}
          saveInProgress={spendingCategories.saveState.loading}
        >
          <SpendingCategoriesFormControl {...spendingCategories} />
        </SettingsBock>

        <Box my={4}/>

        <SettingsBock
          title="Notifications channel"
          text="Please choose your preferable chanel to receive notifications from Wallit"
          allowSaveChanges={selectedNotificationMethods.length !== notificationChannels.length}
          onSave={handleSaveNotificationPreferences}
          saveInProgress={saveNotificationChannelsPreferencesState.loading}
        >
          <FormControl onChange={handleNotificationMethodsChange}>
            <FormControlLabel
              control={<Checkbox value="EMAIL"/>}
              label="Email"
              checked={selectedNotificationMethods.includes("EMAIL")}
            />
            <FormControlLabel
              control={<Checkbox value="SMS"/>}
              label="SMS"
              checked={selectedNotificationMethods.includes("SMS")}
            />
            <FormControlLabel
              control={<Checkbox value="PUSH"/>}
              label="Push"
              checked={selectedNotificationMethods.includes("PUSH")}
            />
          </FormControl>
        </SettingsBock>

        <Box my={4}/>

        <SettingsBock
          title="Offers frequency"
          text="Please advice how Wallit can we disturb you with notifications about offers"
          allowSaveChanges={selectedOfferFrequency !== offerFrequency}
          onSave={handleSaveOrderFrequencyPreferences}
          saveInProgress={saveOfferFrequencyState.loading}
        >
          <FormControl onChange={handleOfferFrequencyChange}>
            <FormControlLabel
              control={<Radio/>}
              checked={selectedOfferFrequency === UserOfferFrequency.NoOffers}
              value={UserOfferFrequency.NoOffers}
              label="Don't want to receive offers for now"
            />
            <FormControlLabel
              control={<Radio/>}
              checked={selectedOfferFrequency === UserOfferFrequency.AssSoonAsPossible}
              value={UserOfferFrequency.AssSoonAsPossible}
              label="As soon as possible"
            />
            <FormControlLabel
              control={<Radio/>}
              checked={selectedOfferFrequency === UserOfferFrequency.Daily}
              value={UserOfferFrequency.Daily}
              label="Daily"
            />
            <FormControlLabel
              control={<Radio/>}
              checked={selectedOfferFrequency === UserOfferFrequency.Weekly}
              value={UserOfferFrequency.Weekly}
              label="Weekly"
            />
            <FormControlLabel
              control={<Radio/>}
              checked={selectedOfferFrequency === UserOfferFrequency.BiWeekly}
              value={UserOfferFrequency.BiWeekly}
              label="Bi-weekly"
            />
            <FormControlLabel
              control={<Radio/>}
              checked={selectedOfferFrequency === UserOfferFrequency.Monthly}
              value={UserOfferFrequency.Monthly}
              label="Monthly"
            />
          </FormControl>
        </SettingsBock>
      </>
    </AsyncOperationState>
  );
}
