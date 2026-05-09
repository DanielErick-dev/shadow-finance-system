FROM python:3.11-slim-bookworm AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

FROM python:3.11-slim-bookworm
WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY . .

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

ENV PATH="/app/.venv/bin:$PATH"
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
