export type NotificationBaseProps = {
  id: string;
  onOpen: (id: string) => any | Promise<any>;
}
