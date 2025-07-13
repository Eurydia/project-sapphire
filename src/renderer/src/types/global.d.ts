export {}
declare global {
  interface Window {
    db: {
      ping: () => Promise<pong>
    }
  }
}
