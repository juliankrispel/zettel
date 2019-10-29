# Zettel

## Unreleased
- Remove unused dependencies from @zettel/core

## [0.0.20] - 2019-10-29

### Added
- Added tables example
- Expose DefaultRenderBlock and EditorChildren from @zettel/react

### Fixed
- Regression - Current styles not applied when inserting character #22

## [0.0.19] - 2019-10-28

### Fixed
- Updated `setDomSelection` to look focus and anchor fragment elements with the `data-text-fragment` html attribute and add `data-text-fragment` to text-fragment render prop so we can differentiate text fragments form blocks. Fixes #18


## [0.0.17] - 2019-10-25

### Added
- changelog.md

### Changed
- Add block offsets to renderblock components so that all selection changes are captured.
- Use mdx macro to render .md and evtl .mdx files 🎉🎉🎉
- Update index page to render changelog