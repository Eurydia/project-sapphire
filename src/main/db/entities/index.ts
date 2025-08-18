export const entities = Object.values(
  import.meta.glob("./*.entity.ts", {
    eager: true,
  }),
)
  .flatMap((m: any) => Object.values(m))
  .filter((v): v is Function => typeof v === "function")
