export const extractQuery = (fragments: string[]) => {
  const queries = {
    names: { regex: /^name:/i, values: <string[]>[] },
    projectNames: { regex: /^project:/i, values: <string[]>[] },
  }
  const categories = Object.values(queries)
  for (const fragment of fragments) {
    for (const category of categories) {
      if (category.regex.test(fragment)) {
        category.values.push(
          fragment.replace(category.regex, ""),
        )
        continue
      }
    }
  }
  return Object.fromEntries(
    Object.entries(queries).map(([name, { values }]) => [
      name,
      values,
    ]),
  ) as { [k in keyof typeof queries]: string[] }
}
