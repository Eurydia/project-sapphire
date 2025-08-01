import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export const LogLevel = {
  trace: "trace",
  info: "info",
  warn: "warn",
  error: "error",
  notice: "notice",
} as const

type State = {
  logs: {
    msg: string
    datetime: string
    level: keyof typeof LogLevel
  }[]
}

type Action = {
  beforePromise: <T extends Promise<unknown>>(
    promise: T,
    msg: string,
    options: {
      level: keyof typeof LogLevel
    },
  ) => T
  logNotice: (msg: string) => void
  logWarn: (msg: string) => void
  logInfo: (msg: string) => void
  logError: (msg: string) => void
}

const newLog = (
  msg: string,
  level: keyof typeof LogLevel,
): State["logs"][number] => ({
  msg,
  datetime: new Date(Date.now()).toISOString(),
  level,
})

export const useLoggerStore = create<State & Action>()(
  immer(
    subscribeWithSelector((set) => ({
      logs: [] as State["logs"],
      beforePromise: (
        p,
        msg,
        options = { level: LogLevel.info },
      ) => {
        set(
          (state) =>
            void state.logs.push(newLog(msg, options.level)),
        )
        return p
      },
      logError: (msg) =>
        set(
          (state) =>
            void state.logs.push(newLog(msg, LogLevel.error)),
        ),
      logNotice: (msg) =>
        set(
          (draft) =>
            void draft.logs.push(newLog(msg, LogLevel.notice)),
        ),
      logInfo: (msg) =>
        set(
          (state) =>
            void state.logs.push(newLog(msg, LogLevel.info)),
        ),
      logWarn: (msg) =>
        set(
          (state) =>
            void state.logs.push(newLog(msg, LogLevel.warn)),
        ),
    })),
  ),
)
