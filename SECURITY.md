# Security Policy

## Known Vulnerabilities (Accepted Risk)

**Last updated:** 2026-07-27 (Node 26.5.0 upgrade)

### DevDependency Vulnerabilities
- `firebase-functions-test@3.5.0` → Jest dependencies contain:
  - `brace-expansion` (HIGH - DoS via unbounded expansion)
  - `ts-deepmerge` (MODERATE - Prototype override)
  - `glob` → `minimatch` (HIGH - minimatch vulnerable)
  
**Status:** ✅ ACCEPTED (not in production)
**Reason:** These are test-only dependencies; do not affect deployed application
**Impact:** Cannot upgrade without downgrading firebase-functions-test to 0.3.3 (breaking change)

### Production Vulnerabilities
- `uuid` (MODERATE - buffer bounds check)
  - **Status:** ✅ LOW RISK
  - **Version:** Used by google-gax (transitive via firebase-admin)
  - **Note:** firebase-admin@13.10.0 is compatible with Node 26.5.0

### esbuild
- **Vulnerability:** Windows dev server file read
- **Status:** ✅ MITIGATED (Nuxt 4.5.1 has latest esbuild)

## Pinned Versions (Stable)
```bash
firebase-admin@13.10.0    # ✅ Stable, compatible with Node 26.5.0
firebase-functions@7.3.0   # ✅ Stable
firebase-functions-test@3.5.0  # ✅ Stable (DO NOT downgrade to 0.3.3)
nuxt@4.5.1                # ✅ Stable
@nuxt/ui@4.3.3            # ✅ Stable
node@26.5.0               # ✅ Upgraded from 22.22.3
npm@12.0.1                # ✅ Latest
```

## Upgrade Path for Future
When firebase-functions-test v4+ is released with updated Jest, revisit these vulnerabilities.