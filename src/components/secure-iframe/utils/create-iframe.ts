export const createIframe = (src: string): HTMLIFrameElement => {
  const element = document.createElement('iframe')
  element.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups')
  element.setAttribute('referrerpolicy', 'origin')
  element.src = src
  return element
}
