# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shape Shack v2 is a rebuild of an existing Rails 7.2 MVC app (`~/Documents/repos/shape_shack_app`) into a Rails 8.1 API + React monorepo. The goal is to modernize the stack and deploy to AWS ECS via GitHub Actions CI/CD.

## Development Setup

Copy `.env.example` to `.env` and set `RAILS_MASTER_KEY` from `api/config/master.key`. Then:

```bash
docker compose up
```

This boots all five services: `postgres`, `redis`, `api`, `sidekiq`, `web`. Gems and node modules persist in named Docker volumes — no reinstall on restart. `bundle install` and `db:prepare` run automatically on API startup.

## Common Commands

Run Rails CLI commands inside Docker (do not install gems on the host):

```bash
# Run a Rails generator or task
docker compose run --rm api bin/rails generate <generator>
docker compose run --rm api bin/rails db:migrate

# Run Rails tests
docker compose run --rm api bundle exec rspec
docker compose run --rm api bundle exec rspec spec/models/user_spec.rb

# Run React tests
docker compose run --rm web npm run test
docker compose run --rm web npm run type-check
docker compose run --rm web npm run lint
```

For one-off Ruby commands without a running stack:

```bash
docker run --rm -v $(pwd)/api:/app -w /app ruby:3.3-slim bash -c "gem install rails --no-document && rails <command>"
```

## Architecture

### Monorepo Layout

```
api/    Rails 8.1 API-only (Ruby 3.3.11, PostgreSQL, Redis, Sidekiq)
web/    React 18 + TypeScript + Vite 5
```

### Request Routing

In development, the Vite dev server (port 5173) proxies `/api/*` to Rails (port 3000). In production, an ALB routes `/api/*` → Rails and `/*` → React/nginx on the same domain — so no CORS is needed anywhere.

### Backend (`api/`)

- **Auth**: Devise + devise-jwt — JWT in `Authorization` header, refresh token in httpOnly cookie
- **Authorization**: Pundit policies
- **Serialization**: Blueprinter
- **File uploads**: Shrine — local filesystem in dev, S3 in production (required for stateless ECS containers)
- **Background jobs**: Sidekiq backed by Redis (Solid Queue was removed)
- **Money/currency**: money-rails gem
- **Tests**: RSpec request specs; FactoryBot for fixtures

### Frontend (`web/`)

- **Routing**: TanStack Router
- **Server state / data fetching**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **HTTP client**: ky
- **Styling**: Tailwind CSS v3
- **Tests**: Vitest + @testing-library/react

### Infrastructure

- **CI**: `.github/workflows/ci.yml` — parallel `rails-tests` and `react-tests` jobs on every push/PR to main
- **Deploy target**: GitHub Actions → ECR → ECS Fargate (not yet implemented)
- **AWS services**: RDS (PostgreSQL), ElastiCache (Redis), S3 (Shrine uploads), ECR, ECS, ALB

## Existing App Reference

The source app at `~/Documents/repos/shape_shack_app` (Rails 7.2) contains the models being ported:

- **Models**: User, Role, UserRoleAssociation, Product, ProductSize, ProductImage, Order, Message, Testimonial
- **Auth**: Devise (session-based) — being replaced with Devise-JWT
- **File uploads**: Shrine (filesystem) — being replaced with Shrine → S3

Use the existing app as the canonical reference for business logic, validations, and associations when porting models.

## Migration Progress

- **Done**: Monorepo bootstrap — Rails API, React + Vite, Docker Compose (all 5 services verified), CI pipeline, Tailwind, all npm deps, Vite proxy
- **Next**: Port Rails models (User, Role, UserRoleAssociation, Product, ProductSize, ProductImage, Order, Message, Testimonial), add money-rails and Shrine initializers, write RSpec model specs
- **Pending**: Auth/admin endpoints → React scaffold → Public pages → Admin pages → S3 image upload → ECS deploy
