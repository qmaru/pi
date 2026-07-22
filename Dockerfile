FROM node:24-trixie AS base

WORKDIR /src

RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent \
    && pi install npm:pi-mcp-adapter

FROM cgr.dev/chainguard/wolfi-base AS runtime

RUN apk add --no-cache nodejs-24-minimal bash ca-certificates tzdata fontconfig fd ripgrep

WORKDIR /workspace

ENV PATH="/usr/local/lib/node_modules/npm/bin:${PATH}"
ENV TZ=UTC
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

COPY prompts/AGENTS.md prompts/README.md /workspace/

RUN ln -s /usr/local/lib/node_modules /usr/bin/node_modules

FROM runtime AS pi-base

COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi

ENTRYPOINT ["pi"]

FROM runtime AS pi-full

COPY skills/mcp /root/.pi/agent/skills/mcp
COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=base /root/.pi/agent/npm /root/.pi/agent/npm

RUN ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi

ENTRYPOINT ["pi"]
