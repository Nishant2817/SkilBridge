# Contributing to SkillBridge

Thank you for considering contributing to SkillBridge! This guide explains our workflow so that all contributions are visible, meaningful, and easy to review.

---

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Branch Strategy](#branch-strategy)
- [Commit Conventions](#commit-conventions)
- [Pull Request Workflow](#pull-request-workflow)
- [Local Development Setup](#local-development-setup)
- [Code Style](#code-style)
- [Reporting Issues](#reporting-issues)

---

## 🗂 Project Structure

Before contributing, familiarise yourself with the codebase:

- [`backend/README.md`](./backend/README.md) — API documentation, DB schema, socket events
- [`frontend/README.md`](./frontend/README.md) — Routes, components, state management
- [`render.yaml`](./render.yaml) — Deployment configuration

---

## 🌿 Branch Strategy

We use a simple **feature branch** workflow:

```
main                  ← production-ready, protected
 └── feature/...      ← new features
 └── fix/...          ← bug fixes
 └── docs/...         ← documentation updates
 └── chore/...        ← maintenance tasks (deps, config)
```

### Rules

1. **Never commit directly to `main`** — always branch off it.
2. Branch names should be short and descriptive:
   - ✅ `feature/seller-reviews`
   - ✅ `fix/checkout-price-bug`
   - ❌ `my-branch`, `test123`
3. Delete your branch after the PR is merged.

---

## ✍️ Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.

### Format

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates |

### Examples

```bash
git commit -m "feat(gigs): add category filter to browse page"
git commit -m "fix(auth): handle expired token gracefully"
git commit -m "docs(backend): add socket.io event reference"
git commit -m "chore(deps): update razorpay to v2.9.6"
```

---

## 🔀 Pull Request Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, atomic commits.

3. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** on GitHub:
   - Use a descriptive title matching the conventional commit format
   - Fill in the PR description (what, why, how to test)
   - Link any related issues with `Closes #issue-number`

5. **Request a review** from one of the maintainers.

6. **Merge** once approved — we squash merge to keep `main` history clean.

---

## 🛠 Local Development Setup

See the root [README.md](./README.md#-quick-start) for full setup instructions.

**Quick reference:**

```bash
# Clone
git clone https://github.com/akshitasyal/SkilBridge.git && cd SkilBridge

# Install all dependencies
npm install

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

---

## 🎨 Code Style

- **Backend**: ES Modules (`import`/`export`), async/await, no raw callbacks
- **Frontend**: Functional components only, React hooks, no class components
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components, `UPPER_SNAKE` for constants
- **No unused imports**: Clean up before committing
- Run `npm run lint` in `frontend/` before submitting a PR

---

## 🐛 Reporting Issues

Found a bug? Have a feature request?

1. Check if an [issue already exists](https://github.com/akshitasyal/SkilBridge/issues)
2. If not, [open a new issue](https://github.com/akshitasyal/SkilBridge/issues/new) with:
   - A clear title
   - Steps to reproduce (for bugs)
   - Expected vs actual behaviour
   - Screenshots if applicable

---

## 👥 Maintainers

| Name | GitHub | Role |
|---|---|---|
| Akshita Syal | [@akshitasyal](https://github.com/akshitasyal) | Full-Stack |
| Chetan Chauhan | [@Chetan6969](https://github.com/Chetan6969) | Backend & DevOps |

---

*SkillBridge is a collaborative learning project. We welcome all contributions that genuinely improve the platform.*
