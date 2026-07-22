---
name: mcp
description: Provides access to external capabilities exposed through MCP servers. Use this skill when a task requires tools provided by connected MCP plugins.
---

# MCP Skill

## Purpose

This skill defines how to use MCP-based external tools that are already configured and exposed by the runtime MCP adapter.

MCP servers are plugins that extend the agent's capabilities.

The runtime exposes one MCP proxy tool named `mcp`. This skill does not install packages or create MCP servers.

## Usage

When a task requires an external capability:

1. Search the available MCP tools with the runtime `mcp` tool.
2. Describe an unfamiliar tool and inspect its schema.
3. Call the selected tool with the exact JSON-string argument format.
4. Return the result and report tool errors clearly.

## Runtime MCP Calls

Use these forms:

```json
{"search":"screenshot navigate"}
```

```json
{"describe":"server_tool_name"}
```

```json
{"tool":"server_tool_name","args":"{\"key\":\"value\"}"}
```

The `args` field is a JSON string, not a nested JSON object. Use the actual runtime `mcp` tool for these calls; do not run `npx`, `npm`, or install MCP packages from the agent.

## Rules

- Only use MCP capabilities exposed by the runtime MCP adapter and follow this skill.
- Do not assume MCP servers or tools exist.
- Search or inspect unfamiliar tools before use.
- Follow tool schemas exactly.

## MCP Providers

MCP providers are configured by the runtime and may be lazy-loaded on first use. A configured server may still be unavailable if its process, credentials, or network dependencies are missing.

Available providers are discovered at runtime.
