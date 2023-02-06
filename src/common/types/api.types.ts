import {DiscountOfferType, NotificationType} from "../../__generated__/graphql";

export type TransactionItemType = {
  amount: number;
  isoCurrencyCode: string;
  name: string;
  category: string;
  date: string;
  datetime?: string;
};

export type AccountItemType = {
  id: string;
  name: string;
  balanceAvailable: number;
  balanceCurrent: number;
  balanceIsoCurrencyCode: string;
};

export type FinancialInstitutionItemType = {
  name: string;
  accounts: AccountItemType[];
}

export type SpendingCategoryItemType = {
  id: string;
  name: string;
}

export type NotificationItemType = {
  id: string;
  type: NotificationType;
  checkedInApp: boolean;
  notificationDiscountOffer?: DiscountOfferItemType;
};

export type DiscountOfferItemType = {
  id: string;
  amount: number;
  currency?: string | null;
  description: string;
  type: DiscountOfferType;
  merchantSpecificIdentification: string;
  // ISO date
  createdAt: Date;
  // ISO Date
  expiresAt: Date;
  ownerMerchant: MerchantItemType;
};

export type MerchantItemType = {
  id: string;
  name: string;
};
