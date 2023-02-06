import {gql} from "../../__generated__";
import {AsyncOperationState} from "../../common/components/async-operation-state/AsyncOperationState";
import {PageBase} from "../../common/components/layout/PageBase";
import {useLazyQuery} from "@apollo/client";
import {useUserProfile} from "../../features/identity/hooks/useUserProfile";
import {useEffect, useMemo} from "react";
import {DiscountOfferItemType} from "../../common/types";
import {queryUtils} from "../../common/utils";
import {parseISO} from "date-fns";
import {DiscountOffer} from "../../__generated__/graphql";
import {NotFoundPlaceholder} from "../../common/components/placeholders/NotFoundPlaceholder";
import List from "@mui/material/List";
import {DiscountOfferListItem} from "../../features/discount-offer/components/DiscountOfferListItem";
import {useParams} from "react-router-dom";

const GET_ACTIVE_OFFERS = gql(/*GraphQL*/`
    query GetActiveDiscountOffers($userId: ID!, $currentTime: Time) {
        discountOffers(
            where: {
                expiresAtGTE: $currentTime,
                hasDiscountEligibleUsersWith: {id: $userId}
            },
            orderBy: {field: CREATED_AT, direction: DESC}
        ) {
            edges {
                node {
                    id
                    amount
                    type
                    merchantSpecificIdentification
                    expiresAt
                    ownerMerchant {
                        id
                        name
                    }
                }
            }
        }
    }
`);

export function OffersScreen() {
  const params = useParams();
  console.log(params);
  const [userProfile] = useUserProfile();
  const [getActiveOffers, activeOffersQuery] = useLazyQuery(GET_ACTIVE_OFFERS, {
    fetchPolicy: "cache-and-network",
    pollInterval: 30000 // @TODO: add time constants
  });

  useEffect(() => {
    getActiveOffers({
      variables: {
        userId: userProfile!.id,
        currentTime: new Date().toISOString(),
      },
    });
  }, [getActiveOffers, userProfile]);

  const offers = useMemo(() => {
    const result: DiscountOfferItemType[] = [];

    if (!queryUtils.isLoadingOrError(activeOffersQuery) && activeOffersQuery?.data?.discountOffers?.__typename === "DiscountOfferConnection") {
      for (const discountOffer of activeOffersQuery.data.discountOffers.edges || []) {
        if (discountOffer?.node?.__typename !== "DiscountOffer") {
          continue;
        }

        const offer = discountOffer.node as DiscountOffer;
        result.push({
          ...offer,
          createdAt: parseISO(offer.createdAt),
          expiresAt: parseISO(offer.expiresAt),
        });
      }
    }

    return result;
  }, [activeOffersQuery]);

  /*@TODO: add displaying information about a user to the card so it can be fixated by in the store during discount usage*/
  /*@TODO: add a barcore that will be scanned by the pair app in the store and will fixate discount consumption or at least validate the discount*/
  return (
    <AsyncOperationState component={PageBase} operation={activeOffersQuery}>
      {offers.length ? (
        <List>
          {offers.map(offer => (
            <DiscountOfferListItem key={offer.id} preSelectedItemId={params.id} {...offer} />
          ))}
        </List>
        ) : (
        <NotFoundPlaceholder>
          No discount offers available
        </NotFoundPlaceholder>
      )}
    </AsyncOperationState>
  )
}
