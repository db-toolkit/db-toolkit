# Version Update Checklist

When bumping version, update the following files:

## Backend
- [ ] `src/db-toolkit/pyproject.toml` - Line 7: `version = "X.X.X"`
- [ ] `src/db-toolkit/main.py` - Line 28: `version="X.X.X"` (FastAPI app)

## Frontend (Desktop App)
- [ ] `src/db-toolkit-ui/package.json` - Line 4: `"version": "X.X.X"`
- [ ] `src/db-toolkit-ui/electron/main.js` - Line 37: `Version: X.X.X` (About dialog)

## Documentation Site
- [ ] `src/docs/package.json` - Line 4: `"version": "X.X.X"`
- [ ] `src/docs/src/data/changelog.ts` - Add new version entry at top
- [ ] `src/docs/src/pages/ChangelogPage.tsx` - Line 44: `vX.X.X` (sidebar version display)

## Website
- [ ] `src/web/package.json` - Line 3: `"version": "X.X.X"`
- [ ] `src/web/components/Hero.js` - Line 82: Version badge text `v0.X.X - Description`

## Root Files
- [ ] `README.md` - Line 5: Version badge `version-X.X.X-blue`
- [ ] `CHANGELOG.md` - Add new version section with changes

## Version Naming Convention

- **Major (X.0.0)** - Breaking changes, major rewrites
- **Minor (0.X.0)** - New features, significant additions
- **Patch (0.0.X)** - Bug fixes, small improvements

## After Updating

1. Commit changes: `git commit -m "Bump version to X.X.X"`
2. Create git tag: `git tag vX.X.X`
3. Push with tags: `git push origin main --tags`
4. Create GitHub release with changelog
