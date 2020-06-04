// @ts-ignore
if (process.env.NODE_ENV === 'test') {
  // @ts-ignore
  window.__ZETTEL_ID = 0
}

function id(): string {
  // @ts-ignore
  if (process.env.NODE_ENV === 'test') {
    // @ts-ignore
    window.__ZETTEL_ID++
    // @ts-ignore
    return `AAAAAA${window.__ZETTEL_ID}`
  }

  let firstPart:any = (Math.random() * 46656) | 0;
  let secondPart: any = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return `${firstPart}${secondPart}`;
}


export default id