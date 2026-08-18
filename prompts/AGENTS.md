# Agent Instructions

This runtime uses a skill-first, general-purpose execution model and runs in a
non-interactive CLI environment. Skills provide reusable procedures and domain
guidance; they are not the only way to complete a task.

## Core Principle

Understand the user's goal, constraints, and requested deliverable first. Use
the most relevant available skill when it directly applies, then combine it
with repository inspection, documented CLI tools, editing, testing, and normal
engineering judgment as needed.

Do not invent tools, MCP servers, capabilities, or results. Do not install
packages or change external service configuration unless the user explicitly
requests it and the applicable instructions permit it.

## Execution Policy

1. Read `README.md` before selecting a skill or running project-specific
   commands. Treat documented runtime commands and capabilities as the source
   of truth.
2. Identify the relevant skill(s), if any. Prefer a skill when it directly
   applies, and follow its instructions to the extent they are relevant.
3. If no skill applies, a skill is unavailable, or a skill does not cover the
   whole task, continue with safe, documented tools and ordinary engineering
   judgment. Do not stop solely because there is no exact skill match.
4. Inspect before editing, preserve existing changes, minimize unrelated
   modifications, and verify changes in proportion to their risk.
5. Ask a question only when a genuinely missing decision would materially
   change the result. Otherwise make a conservative, explicit assumption.

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

At session start, read `README.md` once before selecting a skill or running
project-specific commands. Then inspect the applicable skills and project
context. Do not assume undocumented capabilities exist.

## Skill Usage

For every request, determine whether an available skill materially helps. Use
the smallest set of skills that covers the relevant part of the work. Skills
may be combined with ordinary repository work and do not force unrelated tasks
through a skill-specific route.

Rules:

- Never invent a skill or claim a skill was used when it was not.
- Read a selected skill's `SKILL.md` completely before relying on it.
- Prefer the most specific applicable skill when multiple skills are available.
- If a selected skill cannot be used cleanly, state the limitation briefly and
  use a safe fallback for the remaining work.
- Ask only for information that is genuinely required to proceed safely.

## MCP Usage

MCP usage must follow the `mcp` skill. MCP server capabilities may be exposed as runtime tools; their names and availability are determined by the active integration and its configuration.

Rules:

- Check the currently exposed runtime tools before choosing an alternate
   execution path for an external capability.
- Use exposed MCP tools directly, with the JSON object required by each tool's schema.
- Read the description and schema before calling an unfamiliar MCP tool.
- Do not assume MCP servers or capabilities exist.
- Do not install MCP packages with `npx`, `npm`, or another package manager from the agent.
- If a required MCP tool is not exposed, follow the one-shot recovery procedure in the skill; do not repeat discovery or recovery indefinitely.
- Do not use MCP tools that require GUI, browser windows, or interactive sessions.
- Prefer headless and CLI-compatible MCP capabilities.

## Tool Restrictions

Use only documented commands, available runtimes, and exposed tools. A
matching skill is preferred for specialized or external capabilities, but its
absence does not prohibit ordinary project work such as reading files, making
requested edits, running documented checks, or explaining results.

Never execute undocumented commands, use unavailable runtimes, access external
systems through an unexposed path, or launch external applications.

## Output Rules

- Follow skill-defined output formats.
- If no format is specified, return plain text suitable for terminal display.
- Do not reveal internal reasoning.

## File Output

Default to returning results directly in the response. Do not create or save
files unless the user explicitly asks for a file, a saved artifact, or a file
path.

This default does not apply when the task itself explicitly requests creating
or modifying project files. In that case, make the requested project changes
in the project directory and report the changed paths.

When the user explicitly requests a generated output file, place it under:

/workspace/output/<task-name>/

For web output tasks, use the web namespace:

/workspace/output/web/<task-name>/

Rules for generated output files:

- Never write generated output files outside these directories.
- `<task-name>` must be a short, filesystem-safe name using lowercase letters, numbers, and hyphens.
- Keep all files from the same task inside the same directory.
- Return file paths relative to the project root.

Examples:

/workspace/output/report-generation/report.pdf

/workspace/output/web/my-site/index.html
