interface ElementWithDataSet extends HTMLElement {
  readonly dataset: {
    fragmentStart: string,
    fragmentEnd: string,
    blockKey: string
  }
}

export default function getFragmentNode (el: HTMLElement | null): ElementWithDataSet | null {
  if (el == null) {
    return null
  }

  if (el.dataset && el.dataset.blockKey != null && el.dataset.textFragment === 'true') {
    const _el: any = el
    return _el
  } else if (el.parentElement) {
    return getFragmentNode(el.parentElement)
  }

  return null
}
