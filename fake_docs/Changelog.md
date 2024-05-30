# Changelog for FancyWidget.js

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- New animation effects: `slideIn`, `zoom`.

### Fixed

- Resolved an issue with event binding on dynamic elements.

## [1.2.0] - 2023-06-15

### Added

- Support for touch events on mobile devices.
- `destroy` method to properly remove the widget from the DOM.

### Changed

- Improved performance of the `render` method.

### Deprecated

- The `oldRenderMethod` is deprecated and will be removed in version 2.0.0.

## [1.1.0] - 2023-04-20

### Added

- Custom styles feature allowing for more flexible widget styling.
- Expanded the list of supported browsers in the documentation.

### Fixed

- Minor bug fixes and performance improvements.

## [1.0.1] - 2023-02-10

### Fixed

- Patched a memory leak issue identified in version 1.0.0.

## [1.0.0] - 2023-01-01

- Initial release of FancyWidget.js.
- Core features: widget creation, basic animations, event handling.