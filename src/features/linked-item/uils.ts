import {FinancialInstitutionItemType} from "../../common/types";
import {Maybe, PlaidInstitution, PlaidItem} from "../../__generated__/graphql";

export const castApiEntityToFinancialInstitutionType = (entity: Pick<PlaidInstitution, "name" | "accounts">): FinancialInstitutionItemType => ({
  name: entity?.name,
  accounts: (entity.accounts || []).map((account: any) => ({
    id: account.id,
    name: account.name,
    balanceAvailable: account.balanceAvailable,
    balanceCurrent: account.balanceCurrent,
    balanceIsoCurrencyCode: account.balanceIsoCurrencyCode,
  }))
});
