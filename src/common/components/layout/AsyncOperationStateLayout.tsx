import {QueryResult} from "@apollo/client";
import React, {ComponentProps, PropsWithChildren, ReactNode} from "react";
import {Fill} from "./Fill";

type Props<T extends React.ElementType> = ComponentProps<typeof Fill> & ComponentProps<T> & {
  component?: T;
  operation: Pick<QueryResult, "called" | "loading" | "error">;
  loading: ReactNode;
  error: ReactNode;
  ignoreNotCalled?: boolean;
};

export function AsyncOperationStateLayout<T extends React.ElementType>({
  operation,
  loading,
  error,
  children,
  component,
  ignoreNotCalled,
  ...props
}: PropsWithChildren<Props<T>>) {
  return (
    // <Fill sx={{maxHeight: "100%"}}>
    // <Fill sx={{minHeight: "100%"}}>
    <Fill component={component} {...props}>
      {
        !ignoreNotCalled && !operation.called
          ? loading
          : operation.error
            ? error
            : operation.loading
              ? loading
              : children
      }
    </Fill>
  );
}
