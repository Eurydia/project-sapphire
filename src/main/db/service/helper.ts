import { FindOperator, In } from "typeorm"

export const InOrUndefined = <T>(
  values: T[] | undefined,
): FindOperator<T> | undefined => {
  if (values === undefined) {
    return undefined
  }
  return values.length > 0 ? In(values) : undefined
}
