/// <reference path="../types/globals.d.ts" />
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"

interface ModelData {
  id: string
  provider?: {
    name: string
    context_window: number
    max_tokens: number
  },
  architecture?: {
    input_modalities: string[]
    output_modalities: string[]
  }
  pricing?: {
    input: number
    output: number
    cache_read: number
    cache_write: number
  }
}

export default async function (pi: ExtensionAPI) {
  const provider = "my-provider"
  const baseUrl = "http://localhost:1234/v1"
  const apiKey = process.env.CUSTOM_PROVIDER_API_KEY

  console.error(`[${provider}] loading`)
  try {
    const response = await fetch(baseUrl + "/models", {
      headers: apiKey ? { authorization: `Bearer ${apiKey}` } : undefined
    })

    if (!response.ok) {
      throw new Error(`[${provider}] models api ${response.status}`)
    }

    const payload = (await response.json()) as {
      data: Array<ModelData>
    }

    console.error(`[${provider}] models:`, payload.data.map(x => x.id).join(", "))

    pi.registerProvider(provider, {
      baseUrl: baseUrl,
      apiKey: apiKey,
      api: "openai-completions",
      models: payload.data.map((model) => ({
        id: model.id,
        name: model.id,
        input: model.architecture?.input_modalities ?? ["text"],
        reasoning: false,
        cost: { input: model.pricing?.input ?? 0, output: model.pricing?.output ?? 0, cacheRead: model.pricing?.cache_read ?? 0, cacheWrite: model.pricing?.cache_write ?? 0 },
        contextWindow: model.provider?.context_window ?? 128000,
        maxTokens: model.provider?.max_tokens ?? 4096,
      })),
    })
    console.error(`[${provider}] registered`)
  } catch (err) {
    console.error(`[${provider}] failed:`, err)
  }
}
