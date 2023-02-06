import {AsyncOperationStateType} from "../types";

export const stateFromOneOf = (...asyncOperations: AsyncOperationStateType[]): AsyncOperationStateType => {
  for (const operation of asyncOperations) {
    // error case handling
    if (operation.called && operation.error) {
      return operation;
    }

    // loading case handling
    if (operation.called && operation.loading) {
      return operation;
    }

    // completed case handling
    if (operation.called) {
      return operation;
    }
  }

  return {
    called: false,
    loading: false,
    error: undefined,
  };
}
