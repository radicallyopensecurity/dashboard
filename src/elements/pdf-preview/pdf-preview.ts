import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { TextLayer, getDocument } from 'pdfjs-dist'

import { theme } from '@/theme/theme'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// @ts-expect-error pdfjs weirdness
const { pdfjsLib } = globalThis
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs'

const ELEMENT_NAME = 'pdf-preview'

@customElement(ELEMENT_NAME)
export class PdfPreview extends LitElement {
  private viewer = createRef<HTMLDivElement>()
  private canvases: HTMLCanvasElement[] = []
  private textLayers: HTMLDivElement[] = []

  @property()
  url = ''

  @property()
  password = ''

  static styles = [
    ...theme,
    css`
      :host {
        height: 100%;
        min-height: 100%;
      }

      #wrapper {
        position: relative;
        height: 100%;
        margin: 0 auto;
        overflow-y: auto;
      }

      #viewer {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      canvas {
        display: block;
        margin-bottom: var(--sl-spacing-large);
      }

      .page {
        position: relative;
      }

      .text-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
        width: 100% !important;
        height: 100% !important;
        overflow: clip;
        line-height: 1;
        text-align: initial;
        caret-color: CanvasText;
        opacity: 1;
        transform-origin: 0 0;
        text-size-adjust: none;
        forced-color-adjust: none;
      }

      .text-layer :is(span, br) {
        position: absolute;
        color: transparent;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
      }
    `,
  ]

  protected async firstUpdated() {
    if (!this.viewer.value) {
      throw new Error('root not defined')
    }

    const pdf = await getDocument({
      url: this.url,
      password: this.password,
    }).promise

    for (let pageNumber = 0; pageNumber < pdf.numPages; pageNumber++) {
      const canvas = document.createElement('canvas')

      const textLayer = document.createElement('div')
      textLayer.className = 'text-layer'

      const page = document.createElement('page')
      page.className = 'page'

      page.appendChild(canvas)
      page.appendChild(textLayer)

      this.canvases.push(canvas)
      this.textLayers.push(textLayer)

      this.viewer.value.appendChild(page)
    }

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)

      const scale = 1.5
      const viewport = page.getViewport({ scale: scale })

      const canvas = this.canvases[pageNumber - 1]
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('context not defined')
      }

      canvas.height = viewport.height
      canvas.width = viewport.width

      const textLayer = this.textLayers[pageNumber - 1]
      textLayer.style.setProperty('--scale-factor', viewport.scale.toString())
      textLayer.style.height = `${viewport.height}px`
      textLayer.style.width = `${viewport.width}px`
      textLayer.style.left = `${canvas.offsetLeft}px`
      textLayer.style.top = `${canvas.offsetTop}px`

      this.viewer.value.style.width = `${viewport.width}px`
      this.viewer.value.style.height = `${viewport.height}px`

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }
      await page.render(renderContext).promise

      const textContent = await page.getTextContent()

      const layer = new TextLayer({
        container: textLayer,
        textContentSource: textContent,
        viewport,
      })

      await layer.render()
    }
  }

  render() {
    return html`<div id="wrapper">
      <div id="viewer" ${ref(this.viewer)}></div>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: PdfPreview
  }
}
