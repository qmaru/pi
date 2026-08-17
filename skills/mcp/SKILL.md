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

1. Check the currently exposed runtime tools first. Match the user's request to a tool description before choosing any alternate execution path.
2. Read the tool description and input schema before calling an unfamiliar tool.
3. Call that registered tool directly with a JSON object that conforms to its schema. Do not wrap the request in `{ "tool": ..., "args": ... }` and do not JSON-stringify its arguments.
4. Use the tool result directly. Preserve structured results when they are needed by a later tool call, and clearly report tool-level errors.
5. If no matching tool is exposed, follow the one-shot recovery procedure below before considering the capability unavailable.

## Availability And Recovery

- Do not invent an MCP tool, server, name, or parameter. A configured server may be unavailable, reconnecting, or use `lazy` lifecycle.
- If the required MCP tool is not exposed, use `/mcp` once to inspect all server statuses. Do not use unrelated workspace exploration as a substitute for MCP discovery.
- If the status identifies the configured server needed for the task and it is stopped, start that exact server with `/mcp:start <name>` at most once. For a lazy server, this is the only action that initiates its connection.
- After starting it, wait for one runtime tool-list refresh and call the exact newly exposed tool if it appears. Do not guess its name from a prefix or server name.
- If the server is still stopped, reports a connection error, or the tool does not appear after that refresh, stop the MCP path for this request and report the status. Do not repeat recovery actions or poll in a loop.
- If a direct tool call reports a connection or timeout error, inspect its server with `/mcp <name>` once and do not automatically retry the call.
- Tool availability can refresh while the session is running. After a successful recovery, inspect the currently exposed MCP tools again and use their exact names and schemas.
- If the server remains unavailable, report the status or error and stop. Do not silently switch to an alternate client or transport, and do not repeat the recovery attempt.

## Rules

- Only use MCP capabilities exposed as registered runtime tools and follow this skill.
- Do not install MCP packages, run `npx` or `npm`, or create/change MCP server configuration unless the user explicitly requests it.
- Follow each exposed tool schema exactly, including required fields and value types.
- Respect the tool's safety annotations and description. Confirm intent before destructive actions when the request is ambiguous.
- Do not use MCP tools that require a GUI, browser window, or interactive session in this headless runtime.

## Server Lifecycle

MCP servers are configured by the runtime and may be started eagerly or lazily. The extension discovers tools on connection, refreshes them when a server announces a change, and deactivates them when the server disconnects.

Available tools and their schemas are discovered at runtime.
