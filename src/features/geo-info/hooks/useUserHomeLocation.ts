import {gql} from "../../../__generated__";
import {useGeoValues} from "./useGeoValues";
import {useUserProfile} from "../../identity/hooks/useUserProfile";
import {useMutation, useQuery} from "@apollo/client";
import {useMemo} from "react";
import {useSnackbar} from "notistack";
import {GetUserHomeLocationQuery} from "../../../__generated__/graphql";
import {UseGeoValuesParams} from "../types";
import {CUSTOM_CITY_ID, CUSTOM_COUNTRY_ID, CUSTOM_STATE_ID} from "../constants";

const GET_USER_HOME_LOCATION = gql(/*GraphQL*/`
    query GetUserHomeLocation($userId: ID!) {
        node(id: $userId) {
            id
            ... on User {
                homeCountry
                homeState
                homeCity
            }
        }
    }
`);

const UPDATE_USER_HOME_LOCATION = gql(/*GraphQL*/`
    mutation UpdateUserHomeLocation($userId: ID!, $country: String!, $state: String!, $city: String!) {
        updateUser(
            id: $userId,
            input: {
                homeCountry: $country,
                homeState: $state,
                homeCity: $city
            },
        ) {
            homeCountry
            homeState
            homeCity
        }
    }
`);

export const useUserHomeLocation = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [userProfile] = useUserProfile();
  const homeLocationQuery = useQuery(GET_USER_HOME_LOCATION, {
    variables: {
      userId: userProfile!.id,
    },
  });
  const [updateHomeLocation, updateHomeLocationState] = useMutation(UPDATE_USER_HOME_LOCATION, {
    update: (cache, result) => {
      const queryCache = cache.readQuery({
        query: GET_USER_HOME_LOCATION,
      });

      if (!queryCache) {
        return;
      }

      const node = (queryCache as GetUserHomeLocationQuery).node;

      cache.writeQuery({
        query: GET_USER_HOME_LOCATION,
        data: {
          node: {
            ...node,
            ...result,
          } as any,
        },
      })
    }
  });

  const useGeoValuesParams = useMemo(() => {
    const location: Required<UseGeoValuesParams> = {
      defaultValues: {},
    };

    if (homeLocationQuery.data?.node?.__typename === "User") {
      location.defaultValues.homeCountry = homeLocationQuery.data.node.homeCountry || "";
      location.defaultValues.homeState = homeLocationQuery.data.node.homeState || "";
      location.defaultValues.homeCity = homeLocationQuery.data.node.homeCity || "";
    }

    return location;
  }, [homeLocationQuery]);

  const geoValuesAndHandles = useGeoValues(useGeoValuesParams);

  const save = async () => {
    const result = await updateHomeLocation({
      variables: {
        userId: userProfile!.id,
        country: geoValuesAndHandles.country?.id === CUSTOM_COUNTRY_ID ? geoValuesAndHandles.country.label : geoValuesAndHandles.country?.id ?? "",
        state: geoValuesAndHandles.state?.id === CUSTOM_STATE_ID ? geoValuesAndHandles.state.label : geoValuesAndHandles.state?.id ?? "",
        city: geoValuesAndHandles.city?.id === CUSTOM_CITY_ID ? geoValuesAndHandles.city.label : geoValuesAndHandles.city?.label ?? "",
      }
    });

    if (result.errors) {
      enqueueSnackbar("Some error happened during settings update.. Please try again in a minute", {
        variant: "error",
      });

      return {
        error: true,
      };
    }

    const refetchResult = await homeLocationQuery.refetch();
    if (refetchResult.errors) {
      enqueueSnackbar("Some error happened during settings update.. Please try again in a minute", {
        variant: "error",
      });

      return {
        error: true,
      };
    }

    geoValuesAndHandles.reset("edit-state");

    return {
      error: false,
    }
  };

  return {
    ...geoValuesAndHandles,
    query: homeLocationQuery,
    save,
    saveState: updateHomeLocationState,
  }
};
