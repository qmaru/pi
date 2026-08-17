---
name: mcp
description: Provides access to external capabilities exposed through MCP servers. Use this skill when a task requires tools provided by connected MCP plugins.
---

# MCP Skill

## Purpose

This skill defines how to use external capabilities provided by configured MCP servers. The runtime may expose each discovered MCP capability as a normal tool, with names determined by the active MCP integration and its configuration.

Do not infer tool names from an extension, server, prefix, or naming convention. Registered names may be customized, sanitized, or suffixed to avoid collisions; always use the exact tool name exposed by the runtime.

## Usage

When a task requires an external capability:

1. Look for an available runtime tool whose description identifies it as the required MCP capability.
2. Read the tool description and input schema before calling an unfamiliar tool.
3. Call that registered tool directly with a JSON object that conforms to its schema. Do not wrap the request in `{ "tool": ..., "args": ... }` and do not JSON-stringify its arguments.
4. Use the tool result directly. Preserve structured results when they are needed by a later tool call, and clearly report tool-level errors.

## Availability And Recovery

- Do not invent an MCP tool, server, name, or parameter. A configured server may be unavailable, reconnecting, or use `lazy` lifecycle.
- If the required MCP tool is not exposed, use `/mcp` to inspect all server statuses. Use `/mcp <name>` for a server's status and stderr log.
- Start a stopped lazy server with `/mcp:start <name>`; stop a server only when the task explicitly requires it.
- If a direct tool call reports a connection or timeout error, inspect its server with `/mcp <name>`. Retry only when the operation is safe to repeat; do not automatically repeat non-idempotent or destructive operations.
- Tool availability can refresh while the session is running. After a successful recovery, inspect the currently exposed MCP tools again and use their exact names and schemas.

## Rules

- Only use MCP capabilities exposed as registered runtime tools and follow this skill.
- Do not install MCP packages, run `npx` or `npm`, or create/change MCP server configuration unless the user explicitly requests it.
- Follow each exposed tool schema exactly, including required fields and value types.
- Respect the tool's safety annotations and description. Confirm intent before destructive actions when the request is ambiguous.
- Do not use MCP tools that require a GUI, browser window, or interactive session in this headless runtime.

## Server Lifecycle

MCP servers are configured by the runtime and may be started eagerly or lazily. The extension discovers tools on connection, refreshes them when a server announces a change, and deactivates them when the server disconnects.

Available tools and their schemas are discovered at runtime.
