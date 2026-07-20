FROM node:24-trixie AS builder

WORKDIR /src

RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent

RUN pi install npm:pi-mcp-adapter

FROM cgr.dev/chainguard/wolfi-base AS runtime

RUN apk add --no-cache nodejs-24-minimal ca-certificates tzdata fontconfig fd ripgrep

WORKDIR /workspace

COPY AGENTS.md README.md /workspace/

COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=builder /root/.pi/agent/npm /root/.pi/agent/npm

RUN ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/sbin/npx \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/sbin/npm \
    && ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi

ENV TZ=UTC

ENTRYPOINT ["pi"]
