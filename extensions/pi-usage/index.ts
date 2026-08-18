/// <reference path="../types/globals.d.ts" />
import type { ExtensionAPI, ExtensionContext, Usage } from "@earendil-works/pi-coding-agent"
import { writeFileSync } from "node:fs"

function formatTokens(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function formatCost(value: unknown) {
  const cost = Number(value)
  return (Number.isFinite(cost) ? cost : 0).toFixed(6)
}

function formatUsageText(usage: Usage) {
  return [
    `💰 $${formatCost(usage?.cost?.total)} · ${formatTokens(usage?.totalTokens || 0)} tokens`,
    `Input ${formatTokens(usage?.input || 0)} Output ${formatTokens(usage?.output || 0)} Reasoning ${formatTokens(usage?.reasoning || 0)}`,
    `Cache RW ${formatTokens(usage?.cacheRead || 0)} · ${formatTokens(usage?.cacheWrite ?? 0)}`,
  ].join("\n\n")
}

function formatUsageMarkdown(usage: Usage): string {
  return [
    `💰 **$${formatCost(usage?.cost?.total)}** · **${formatTokens(usage?.totalTokens || 0)} tokens**`,
    `**Input** ${formatTokens(usage?.input || 0)} **Output** ${formatTokens(usage?.output || 0)} **Reasoning** ${formatTokens(usage?.reasoning || 0)}`,
    `**Cache RW** ${formatTokens(usage?.cacheRead || 0)} · ${formatTokens(usage?.cacheWrite || 0)}`,
  ].join("\n\n")
}

export default function (pi: ExtensionAPI) {
  console.error("[pi-usage] loaded")

  const usageFile = process.env.PI_USAGE_FILE
  const usageStdout = process.env.PI_USAGE_STDOUT === "1"
  const usageMarkdown = process.env.PI_USAGE_MARKDOWN === "1"
  let modelId: string | undefined
  let sessId: string | undefined

  if (!usageFile && !usageStdout) {
    return
  }

  if (usageFile) {
    console.error(`[pi-usage] file enabled: ${usageFile}`)
  }

  if (usageStdout) {
    console.error("[pi-usage] stdout enabled")
  }

  let lastUsage: Usage | null = null

  pi.on("message_end", (event, ctx: ExtensionContext) => {
    modelId = ctx?.model?.id
    sessId = ctx.sessionManager?.sessionId

    const message = event.message

    if (message.role === "assistant" && message.usage) {
      lastUsage = message.usage
    }
  })

  process.on("exit", () => {
    if (!lastUsage) return

    if (usageFile) {
      writeFileSync(usageFile, JSON.stringify(lastUsage, null, 2))
    }

    if (usageStdout) {
      let output = ""
      if (usageMarkdown) {
        output = "\n---\n" + formatUsageMarkdown(lastUsage)
        console.log(output + (modelId ? `\n\n**Model** \`${modelId}\`` + (sessId ? `\n\n**Session** \`${sessId}\`` : "") : ""))
      } else {
        output = "\n\n" + formatUsageText(lastUsage)
        console.log(output + (modelId ? `\n\nModel ${modelId}` + (sessId ? `\n\nSession ${sessId}` : "") : ""))
      }
    }
  })
}
