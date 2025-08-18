export const migrations = Object.values(
  import.meta.glob("./*-Auto.ts", {
    eager: true,
  }),
)
  .flatMap((m: any) => Object.values(m))
  .filter(
    (v): v is Function =>
      typeof v === "function" &&
      typeof v.prototype?.up === "function",
  )
