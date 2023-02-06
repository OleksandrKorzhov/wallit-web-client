import {makeVar} from "@apollo/client";
import {NotificationItemType} from "../../common/types";

export const notificationsVar = makeVar<NotificationItemType[]>([]);
