FROM node:24-trixie AS base

WORKDIR /src

RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent \
    && pi install npm:pi-mcp-adapter

FROM cgr.dev/chainguard/wolfi-base AS runtime

RUN apk add --no-cache nodejs-24-minimal ca-certificates tzdata fontconfig fd ripgrep

WORKDIR /workspace

ENV PATH="/usr/local/lib/node_modules/.bin:${PATH}"
ENV TZ=UTC

COPY prompts/AGENTS.md prompts/README.md /workspace/
COPY skills/ /workspace/.agents/skills/

FROM runtime AS pi-base

COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi

ENTRYPOINT ["pi"]

FROM runtime AS pi-full

COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=base /root/.pi/agent/npm /root/.pi/agent/npm

RUN ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi

ENTRYPOINT ["pi"]
