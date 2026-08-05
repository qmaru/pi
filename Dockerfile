FROM node:24-trixie AS base

WORKDIR /src

RUN apt update && apt install -y curl upx

RUN npm install -g --ignore-scripts @earendil-works/pi-coding-agent \
    && pi install npm:pi-mcp-extension

RUN PKG="$(npm root -g)/@earendil-works/pi-coding-agent" \
    && find "$PKG" -type f \( -name "*.map" -o -name "*.d.ts" \) -delete \
    && rm -rf "$PKG/docs" "$PKG/examples" "$PKG/CHANGELOG.md" \
    "$PKG/node_modules/@mistralai" \
    "$PKG/node_modules/@aws-sdk" \
    "$PKG/node_modules/@aws" \
    "$PKG/node_modules/@aws-crypto" \
    "$PKG/node_modules/@opentelemetry" \
    && npm cache clean --force

RUN curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

RUN upx --best --lzma /root/.local/bin/rtk

FROM cgr.dev/chainguard/wolfi-base AS runtime

RUN apk add --no-cache nodejs-24-minimal bash ca-certificates tzdata fontconfig fd ripgrep

WORKDIR /workspace

ENV PATH="/usr/local/lib/node_modules/npm/bin:/usr/local/bin:${PATH}" \
    TZ=UTC \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    NODE_ENV=production \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=base /root/.local/bin/rtk /usr/local/bin/rtk

COPY prompts/AGENTS.md prompts/README.md .

RUN ln -sf /usr/local/lib/node_modules /usr/bin/node_modules \
    && ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi \
    && rtk init -g --agent pi

FROM runtime AS pi-base

ENTRYPOINT ["pi"]

FROM runtime AS pi-full

COPY --from=base /root/.pi/agent/npm /root/.pi/agent/npm

COPY skills/mcp /root/.pi/agent/skills/mcp

ENTRYPOINT ["pi"]
