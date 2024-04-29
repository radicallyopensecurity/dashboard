// import { LitElement } from 'lit'

// const createIframe = () => {
//   const iFrame = document.createElement('iframe')
//   iFrame.style.boxSizing = 'content-box'
//   iFrame.style.width = '100%'
//   iFrame.style.border = 'none'
//   iFrame.setAttribute('sandbox', 'allow-same-origin')
//   return iFrame
// }

// export class UnsafeContent extends LitElement {
//   private visible = false
//   private unsafeHTML = null
//   private iFrame = createIframe()

//   get renderedUnsafeHTML() {
//     return this.unsafeHTML
//   }

//   update() {
//     this.visible = !!this.unsafeHTML
//     this.iFrame.srcdoc = !this.visible
//       ? ''
//       : `
// 			<html>
// 				<head>
// 					<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
// 				</head>
// 				<body>
// 					${this.renderedUnsafeHTML}
// 				</body>
// 			</html>
// 		`
//   }

//   updateHeight = () => {
//     if (!this.visible) {
//       this.iFrame.style.height = '0'
//     } else {
//       this.iFrame.style.height =
//         this.iFrame.contentDocument?.documentElement.offsetHeight + 'px'
//     }
//   }

//   createRenderRoot() {
//     return this
//   }

//   get onResize() {
//     if (!this._onResize) {
//       this._onResize = () => {
//         setTimeout(() => this.updateHeight(), 0)
//       }
//     }
//     return this._onResize
//   }

//   connectedCallback() {
//     super.connectedCallback()
//     this.renderRoot.appendChild(this.$iframe)
//     this.$iframe.addEventListener('load', this.onResize)
//     window.addEventListener('resize', this.onResize)
//   }

//   disconnectedCallback() {
//     super.disconnectedCallback()
//     this.$iframe.removeEventListener('load', this.onResize)
//     window.removeEventListener('resize', this.onResize)
//   }
// }
// customElements.define('ui-unsafe-content', UnsafeContent)
