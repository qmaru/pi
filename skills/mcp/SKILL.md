---
name: mcp
description: Provides access to external capabilities exposed through MCP servers. Use this skill when a task requires tools provided by connected MCP plugins.
---

# MCP Skill

## Purpose

This skill provides access to MCP-based external tools.

MCP servers are plugins that extend the agent's capabilities.

## Usage

When a task requires an external capability:

1. Discover available MCP servers.
2. Identify the appropriate MCP tool.
3. Execute the tool according to its schema.
4. Return the result.

## Rules

- Only use MCP tools exposed by this skill.
- Do not assume MCP servers or tools exist.
- Always inspect tool descriptions before use.
- Follow tool schemas exactly.

## MCP Providers

MCP providers are dynamically loaded plugins.

Available providers are discovered at runtime.
