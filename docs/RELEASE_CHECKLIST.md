# Release checklist

- [ ] update visible version strings
- [ ] update `meta.version` in story JSON
- [ ] run `python3 build/audit_story.py`
- [ ] run `python3 build/audit_assets.py`
- [ ] run local HTTP server
- [ ] load title screen without console errors
- [ ] test save/load and autosave
- [ ] test at least one route per major branch family
- [ ] test rollback, AUTO, and SKIP
- [ ] test one CG unlock and one ending unlock
- [ ] verify mobile layout
- [ ] update README/changelog if public behavior changed
