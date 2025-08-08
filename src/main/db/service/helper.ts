import { FindOperator, In } from "typeorm"

export const InOrUndefined = <T>(
  values: T[],
): FindOperator<T> | undefined => {
  return values.length > 0 ? In(values) : undefined
}
