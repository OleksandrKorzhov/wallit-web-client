const simplePredicate = <T = any>(a: T, b: T) => a === b

export const notEqual = <T = any>(a: T[], b: T[], predicate = simplePredicate): boolean => {
  return a.length !== b.length || a.some(aElement => !b.some(bElement => predicate(aElement, bElement)));
}

export const equal = <T = any>(a: T[], b: T[], predicateFn = simplePredicate): boolean => {
  return !notEqual(a, b, predicateFn);
}
