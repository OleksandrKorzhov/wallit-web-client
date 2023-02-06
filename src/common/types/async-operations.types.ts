import {QueryResult} from "@apollo/client";

export type AsyncOperationStateType = Pick<QueryResult, "called" | "loading" | "error">;
