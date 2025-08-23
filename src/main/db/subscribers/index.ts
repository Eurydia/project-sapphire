export const subscribers = Object.values(
  import.meta.glob("./*.subscriber.ts", {
    eager: true,
  }),
)
  .flatMap((m: any) => Object.values(m))
  .filter((v): v is Function => typeof v === "function")
