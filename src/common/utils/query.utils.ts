import {QueryResult} from "@apollo/client";

type QueryStatePredicate = (query: Pick<QueryResult<any, any>, "called" | "loading" | "error">, options?: PredicateOptions) => boolean;

type PredicateOptions = {skipNotCalled: boolean};

export const isLoading: QueryStatePredicate = (query, options) => {
  if (options?.skipNotCalled) {
    return query.loading;
  }

  return !query.called || query.loading;
}

export const isError: QueryStatePredicate = (query, options) => {
  if (options?.skipNotCalled) {
    return Boolean(query.error);
  }

  return query.called && Boolean(query.error);
}

export const isLoadingOrError: QueryStatePredicate = (query, options) =>
  isLoading(query, options) || isError(query, options);
