# Shared Types Package (`@perflens/types`)

Shared TypeScript interface definitions and domain data models for the Perflens platform.

---

## 📦 Exported Types

- `AuditStatus`: `'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'`
- `WebVitals`: Interface containing metrics for `lcp`, `fcp`, `cls`, `tti`, `inp`, `tbt`.
- `LighthouseScores`: Performance, Accessibility, Best Practices, and SEO numerical scores.
- `AuditResult`: Audit metadata, scores, web vitals, JS payload size, and timestamps.
- `Project`: Project metadata, target URL, environment, and latest audit references.
- `BundleAnalysis`: Bundle breakdown and dependency analysis types.

---

## 🛠️ Scripts

```bash
# Verify TypeScript definitions without emitting output
npm run type-check

# Run linting check
npm run lint
```
