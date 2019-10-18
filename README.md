__NOT USE IN PRODUCTION__

# [Zettel](http://zettel.software/)


Framework for building text editors in the browser.

[Join Zettel on Slack](https://join.slack.com/t/zetteljs/shared_invite/enQtNzk4NjM5Njc0Nzg5LTI2ZTljZTMwY2JjMmFkOWM3Yzk5YjdlODgxZWIwMzc5YmE4MGQ1MjViZjUxMmUxZmZjNmY3OTljOWRiMmNmZjg)

[![npm version](https://badge.fury.io/js/%40zettel%2Fcore.svg)](https://badge.fury.io/js/%40zettel%2Fcore)
[![npm version](https://badge.fury.io/js/%40zettel%2Freact.svg)](https://badge.fury.io/js/%40zettel%2Freact)

## Running locally

```bash
# Clone repository
git clone git@github.com:juliankrispel/zettel.git

# Run yarn - there's a postinstall hook that automatically runs
# yarn for all other packages in this repo
yarn

# cd into package and run yarn start

# All current example apps are in the /experiments folder
cd experiments
# This will start create-react-app, experiments will appear at localhost:3000
yarn start
```

## Current Roadmap

This changes a lot. To focus as much as possible I'll keep this small.

- [x] Firefox, Safari, Chrome support
- [x] rendering text
- [x] render blocks
- [x] keeping selection in sync
- [x] All editing operations
- [x] render non-text media
- [x] react view layer
- [x] render text fragments
- [x] redo/undo
- [x] UTF-16 support for editing
- [x] IME Event handling
- [x] Android support (via Input Events Level 2)
- [x] Android support [thanks Trix ❤️](https://github.com/basecamp/trix/blob/master/src/trix/controllers/level_2_input_controller.coffee)
- [x] [IME support](https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide)
- [ ] [rtl support](https://github.com/juliankrispel/zettel/issues/8)
- [ ] Prototype collaborative editing
- [ ] Start writing docs and publishing exampples on codesandbox
- [ ] Alternative view layers (Vuejs/svelte/angular)
