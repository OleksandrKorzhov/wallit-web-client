const authUserRoot = () => "/workspace";

const routingConfig = () => ({
  authUserRoot,
  dashboard: () => `${authUserRoot()}/dashboard`,
  offers: () => `${authUserRoot()}/offers/:id?`,
  linkBankAccount: () => `${authUserRoot()}/link-bank-account`,
  notifications: () => `${authUserRoot()}/notifications`,
  settings: () => `${authUserRoot()}/settings`,
  accountDetails: () => `${authUserRoot()}/account/:id`,
  onboarding: () => "/onboarding", // @TODO: remove
  landing: () => "/",
});

export default routingConfig;
