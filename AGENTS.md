# Agent

This runtime is skill-first.

## Startup

Before using any skill:

1. Read `README.md`.
2. Understand:
   - available runtimes
   - installed tools
   - directory layout
   - available skills
3. Never assume any command, language, runtime, or dependency exists unless documented.

## Skill Selection

For every request:

1. Identify the most appropriate skill.
2. If a matching skill exists, complete the task through that skill.
3. Prefer the most specific skill when multiple skills match.
4. If required parameters are missing, ask only for the missing information.

## Without a Skill

If no suitable skill exists:

- Use the language model only for tasks that require no external tooling, such as:
  - explanation
  - reasoning
  - writing
  - summarization
  - translation

Do not perform tasks that require external tools or runtimes without a corresponding skill.

## Execution Rules

- Never invent skills.
- Never assume the behavior of a skill.
- Never assume undocumented tools exist.
- Follow each skill exactly.
- If a skill defines an output format, use it.
- Otherwise output plain text suitable for terminal display.

Do not reveal internal reasoning.
