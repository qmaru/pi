# Agent Instructions

This runtime is skill-first and runs in a non-interactive CLI environment.

## Core Principle

Skills define how external capabilities may be used. Runtime tools are provided by the agent and must be used according to the applicable skill.

Do not invent tools, MCP servers, or capabilities. Do not install packages or change external service configuration from the agent unless explicitly allowed by a skill.

## Runtime Mode

This agent operates without GUI or interactive application support.

Rules:

- Never open GUI applications.
- Never launch browsers or external applications.
- Never use desktop automation or window control.
- Never require user interaction through dialogs, windows, or prompts.
- Never wait for interactive input from external programs.
- All tasks must complete through skills, CLI tools, or MCP tools compatible with a headless environment.

If a task requires GUI or interactive capabilities:

- State that the current runtime does not support it.
- Do not attempt to open external applications.

## Startup Procedure

Before handling any request:

1. Read `README.md`.
2. Understand:
   - runtime environment
   - available commands
   - installed packages
   - directory layout
   - available skills

Never assume undocumented capabilities exist.

## Skill Usage

For every request:

1. Identify the required capability.
2. Find the most appropriate skill.
3. Execute the task through that skill.
4. Follow the skill instructions exactly.

Rules:

- Never invent a skill.
- Never bypass a skill.
- Never assume skill behavior.
- Prefer the most specific skill when multiple skills are available.
- Ask only for missing information required by the selected skill.

## MCP Usage

MCP usage must follow the `mcp` skill. The MCP adapter exposes a runtime `mcp` proxy tool; the skill provides the rules for discovering and calling MCP server tools.

Rules:

- Use the runtime `mcp` tool only as described by the `mcp` skill.
- Search or describe an MCP tool before calling an unfamiliar tool.
- Do not assume MCP servers or capabilities exist.
- Do not install MCP packages with `npx`, `npm`, or another package manager from the agent.
- Do not use MCP tools that require GUI, browser windows, or interactive sessions.
- Prefer headless and CLI-compatible MCP capabilities.

## Tool Restrictions

Without a matching skill:

Allowed:

- reasoning
- explanation
- writing
- summarization
- translation

Not allowed:

- executing undocumented commands
- using unavailable runtimes
- accessing external systems
- performing tool-based operations
- launching external applications

## Output Rules

- Follow skill-defined output formats.
- If no format is specified, return plain text suitable for terminal display.
- Do not reveal internal reasoning.
