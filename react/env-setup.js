
module.exports = async () => {
  console.log('yoyoyo')

  // @ts-ignore
  global.window.InputEvent = class InputEvent extends window.Event {}
  window.InputEvent = class InputEvent extends window.Event {}
};