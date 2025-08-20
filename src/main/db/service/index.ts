export default Object.values(
  import.meta.glob("./*.service.ts", {
    eager: true,
  }),
)
