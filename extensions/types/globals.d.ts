declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined
  }

  interface Process {
    env: ProcessEnv
    on(event: "exit", listener: () => void): this
  }
}

declare module "node:fs" {
  export interface WriteFileOptions {
    encoding?: string | null
    mode?: number
    flag?: string
  }

  export function writeFileSync(
    file: string,
    data: string,
    options?: WriteFileOptions | string,
  ): void
}

declare module "@earendil-works/pi-coding-agent" {
  export type RunMode = "tui" | "rpc" | "json" | "print"

  export interface UsageCost {
    input?: number
    output?: number
    cacheRead?: number
    cacheWrite?: number
    total: number
  }

  export interface Usage {
    input?: number
    output?: number
    reasoning?: number
    cacheRead?: number
    cacheWrite?: number
    totalTokens?: number
    cost: UsageCost
  }

  export interface AssistantMessage {
    role: "assistant"
    usage?: Usage
  }

  export interface MessageEndEvent {
    message: {
      role: string
      usage?: Usage
    }
  }

  export interface ModelContext {
    id: string
  }

  export interface SessionManager {
    sessionId?: string
  }

  export interface ExtensionContext {
    mode: RunMode
    model?: ModelContext
    sessionManager?: SessionManager
  }

  export interface ExtensionAPI {
    on(event: "agent_start" | "agent_settled", handler: (event: {}, ctx: ExtensionContext) => void): void
    on(
      event: "turn_start",
      handler: (event: { turnIndex: number }, ctx: ExtensionContext) => void,
    ): void
    on(
      event: "turn_end",
      handler: (
        event: {
          turnIndex: number
          toolResults: unknown[]
          message: { usage?: { cost?: { total?: number } } }
        },
        ctx: ExtensionContext,
      ) => void,
    ): void
    on(
      event: "message_update",
      handler: (event: { assistantMessageEvent: unknown }, ctx: ExtensionContext) => void,
    ): void
    on(event: "message_end", handler: (event: MessageEndEvent, ctx: ExtensionContext) => void): void
    on(
      event: "tool_execution_start",
      handler: (event: { toolCallId: string; toolName: string; args: unknown }, ctx: ExtensionContext) => void,
    ): void
    on(
      event: "tool_execution_end",
      handler: (
        event: { toolCallId: string; toolName: string; result: unknown; isError: boolean },
        ctx: ExtensionContext,
      ) => void,
    ): void
    on(
      event: "tool_execution_update",
      handler: (
        event: { toolCallId: string; toolName: string; partialResult: unknown },
        ctx: ExtensionContext,
      ) => void,
    ): void
  }
}
