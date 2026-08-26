/// <reference path="../types/globals.d.ts" />
import type { ExtensionAPI, MessageEndEvent } from "@earendil-works/pi-coding-agent"
import { writeFileSync } from "node:fs"

type MessageContent = string | Array<{ type?: string; text?: string }>

function getText(content: MessageContent | undefined): string {
    if (typeof content === "string") return content
    if (!Array.isArray(content)) return ""

    return content
        .filter((part) => part.type === undefined || part.type === "text")
        .map((part) => part.text ?? "")
        .join("")
}

export default function (pi: ExtensionAPI) {
    console.error("[pi-event] loaded")

    const eventFile = process.env.PI_EVENT_FILE
    const eventStdout = process.env.PI_EVENT_STDOUT === "1"

    if (!eventFile && !eventStdout) return

    if (eventFile) {
        console.error(`[pi-event] file enabled: ${eventFile}`)
    }

    if (eventStdout) {
        console.error("[pi-event] stdout enabled")
    }

    let finalText = ""
    pi.on("message_end", (event: MessageEndEvent) => {
        if (event.message.role !== "assistant") return

        finalText = getText(event.message.content)
    })

    process.on("exit", () => {
        if (!finalText) return

        if (eventFile) {
            writeFileSync(eventFile, finalText, "utf8")
        }

        if (eventStdout) {
            process.stdout.write(finalText + "\n")
        }
    })
}
