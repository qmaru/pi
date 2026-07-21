import { writeFileSync } from "node:fs";

export default function (pi: any) {
  console.error("[pi-usage] loaded");

  const usageFile = process.env.PI_USAGE_FILE;

  if (!usageFile) {
    return;
  }

  console.error(`[pi-usage] enabled: ${usageFile}`);

  pi.on("message_end", (event: any) => {
    const message = event.message;

    if (message.role !== "assistant" || !message.usage) return

    writeFileSync(usageFile, JSON.stringify(message.usage, null, 2)
    );
  });
}