# Runtime Environment

This is a minimal agent runtime environment.

## Operating System

- Wolfi Linux
- Package manager: apk

## Shell Environment

- POSIX shell
- BusyBox utilities

## Runtime

- Node.js 24 / npx / npm

## Available Commands

The following commands are available:

- `node`
- `fd`
- `rg`

Do not assume any other command exists.

## Installed Packages

The following packages are installed:

- ca-certificates
- tzdata
- fontconfig

## Directory Layout

Skills are provided through the skill system.

Before executing any task, inspect available skills and follow their instructions.

## Runtime Constraints

- Minimal runtime environment
- No package installation during execution
- No dependency installation through npm
- Use only documented commands and available skills