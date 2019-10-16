__DO NOT USE IN PRODUCTION__

# Zettel

Framework for building text editors in the browser. __Experimental__

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

## Roadmap

- [x] Firefox, Safari, Chrome support
- [x] rendering text
- [x] render blocks
- [x] keeping selection in sync
- [x] All editing operations
- [x] render non-text media
- [x] react view layer
- [x] render text fragments
- [x] redo/undo
- [ ] UTF-16 support for editing
- [ ] Automated browser tests
- [ ] Prototype collaborative editing
- [ ] [Input events level 2 support](https://www.w3.org/TR/input-events-2/)
- [ ] Android support [thanks Trix ❤️](https://github.com/basecamp/trix/blob/master/src/trix/controllers/level_2_input_controller.coffee)
- [ ] [IME support](https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide)
- [ ] [rtl support](https://www.w3.org/International/articles/inline-bidi-markup/)
- [ ] Docs with tutorials
- [ ] Alternative view layers (Vuejs/svelte/angular)
