import parse from "date-fns/parse";

export const parseTransactionDate = (date: string, referenceDate: Date): Date => parse(date, "yyyy-MM-dd", referenceDate);
