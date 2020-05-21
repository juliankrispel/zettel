# Zettel

## [Unreleased]

### Fixed
- `readOnly` prop now actually makes the editor read only and removes any editor specific css from the editor and block components.

## [0.0.22] - 2020-05-20

### Added
- Added Fragment Model. Fragments are similar to Blocks, they can either contain text or other fragments. They can also contain metadata which makes them useful for things such as mentions. Fragments can cross block boundaries. If `[ ]` is a block boundary and `< >` a fragment boundary we can do things like: `[First <Block][Second> Block]`.
- Soft newlines are now supported and working correctly (tested in markdown example with codeblocks)

## [0.0.21] - 2020-05-18

### Changed
- Tidied up list of examples, better names and better urls, removed examples which are misleading/incomplete

### Fixed
- Remove unused dependencies from @zettel/core
- Remove useMemo in @zettel/react which breaks draggable example

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