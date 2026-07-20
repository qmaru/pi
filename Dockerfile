FROM node:24-trixie AS builder

WORKDIR /src

RUN apt update && apt install -y --no-install-recommends git upx

RUN npm install -g bun

RUN git clone --depth 1 --branch main https://github.com/earendil-works/pi.git .

RUN npm install --ignore-scripts

RUN cd packages/coding-agent && npm run build:binary \
    && upx --best --lzma /src/packages/coding-agent/dist/pi

RUN /src/packages/coding-agent/dist/pi install npm:pi-mcp-adapter

FROM cgr.dev/chainguard/wolfi-base AS runtime

RUN apk add --no-cache nodejs-24-minimal ca-certificates tzdata fontconfig fd ripgrep

WORKDIR /workspace

COPY AGENTS.md README.md /workspace/

COPY --from=builder /src/packages/coding-agent/dist/pi /workspace/pi
COPY --from=builder /src/packages/coding-agent/dist/assets /workspace/assets
COPY --from=builder /src/packages/coding-agent/dist/theme /workspace/theme
COPY --from=builder /src/packages/coding-agent/dist/photon_rs_bg.wasm /workspace/photon_rs_bg.wasm
COPY --from=builder /src/packages/coding-agent/dist/export-html /workspace/export-html
COPY --from=builder /root/.pi/agent/npm /root/.pi/agent/npm

RUN ln -sf /workspace/pi /usr/sbin/pi

ENV TZ=UTC

ENTRYPOINT ["pi"]
