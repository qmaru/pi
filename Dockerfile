FROM node:24-trixie AS base

WORKDIR /src

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

FROM cgr.dev/chainguard/wolfi-base AS extension

RUN apk add --no-cache curl upx

# Install RTK
RUN curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# Compress binary
RUN upx --best --lzma /root/.local/bin/rtk

FROM cgr.dev/chainguard/wolfi-base AS runtime

RUN apk add --no-cache nodejs-24-minimal bash ca-certificates tzdata fontconfig fd ripgrep

WORKDIR /workspace

ENV PATH="/usr/local/lib/node_modules/npm/bin:/usr/local/bin:${PATH}"
ENV TZ=UTC
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

COPY prompts/AGENTS.md prompts/README.md /workspace/
COPY --from=extension /root/.local/bin/rtk /usr/local/bin/rtk

RUN ln -s /usr/local/lib/node_modules /usr/bin/node_modules

FROM runtime AS pi-base

COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi \
    && rtk init -g --agent pi

ENTRYPOINT ["pi"]

FROM runtime AS pi-full

COPY skills/mcp /root/.pi/agent/skills/mcp
COPY --from=base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=base /root/.pi/agent/npm /root/.pi/agent/npm

RUN ln -sf /usr/local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js /usr/sbin/pi \
    && rtk init -g --agent pi

ENTRYPOINT ["pi"]
