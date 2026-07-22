import { writeFileSync } from "node:fs";

function formatTokens(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatUsage(usage: any) {
  return [
    `💰 ${formatTokens(usage.totalTokens)} tokens / $${usage.cost.total.toFixed(6)}`,
    `in ${formatTokens(usage.input)} / out ${formatTokens(usage.output)} / reasoning ${formatTokens(usage.reasoning)}`,
    `cache read ${formatTokens(usage.cacheRead)} / write ${formatTokens(usage.cacheWrite ?? 0)}`,
  ].join("\n");
}

export default function (pi: any) {
  console.error("[pi-usage] loaded");

  const usageFile = process.env.PI_USAGE_FILE;
  const usageStdout = process.env.PI_USAGE_STDOUT === "1";

  if (!usageFile && !usageStdout) {
    return;
  }

  if (usageFile) {
    console.error(`[pi-usage] file enabled: ${usageFile}`);
  }

  if (usageStdout) {
    console.error("[pi-usage] stdout enabled");
  }

  let lastUsage: any = null;

  pi.on("message_end", (event: any) => {
    const message = event.message;

    if (message.role === "assistant" && message.usage) {
      lastUsage = message.usage;
    }
  });

  process.on("exit", () => {
    if (!lastUsage) return;

    if (usageFile) {
      writeFileSync(usageFile, JSON.stringify(lastUsage, null, 2));
    }

    if (usageStdout) {
      console.log("\n" + formatUsage(lastUsage));
    }
  });
}