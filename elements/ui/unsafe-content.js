import { LitElement, html, css } from '../../web_modules/lit-element.js';

export class UnsafeContent extends LitElement {

	constructor() {
		super();
		this.unsafeHTML = "";
		this.baseUrl = "";
	}

	static get properties() {
		return {
			unsafeHTML: {
				type: String,
				notify: true
			}
		}
	}

	get renderedUnsafeHTML() {
		return this.unsafeHTML;
	}

	get contentStyle() {
		return '';
	}

	update(changedProperties) {
		this.$iframe.srcdoc = `
		<html>
			<head>
				<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
				<style>${this.contentStyle}</style>
			</head>
			<body>
				${this.renderedUnsafeHTML}
			</body>
		</html>
		`;
	}

	updateHeight = () => {
		this.$iframe.style.height = this.$iframe.contentDocument.documentElement.offsetHeight + "px";
	}

	createRenderRoot() {
		return this;
	}

	get $iframe() {
		if (!this._$iframe) {
			const $iframe = document.createElement("iframe");
			$iframe.style.boxSizing = "content-box";
			$iframe.style.width = "100%";
			$iframe.style.border = "none";
			$iframe.setAttribute("sandbox", "allow-same-origin");
			this._$iframe = $iframe;
		}
		return this._$iframe;
	}

	get onResize() {
		if (!this._onResize) {
			this._onResize = () => {
				console.log("RESIZE", this);
				setTimeout(() => this.updateHeight(), 0);
			}
		}
		return this._onResize;
	}

	connectedCallback() {
		super.connectedCallback();
		this.renderRoot.appendChild(this.$iframe);
		this.$iframe.addEventListener("load", this.onResize);
		this.$iframe.addEventListener("resize", this.onResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.$iframe.removeEventListener("load", this.onResize);
		this.$iframe.removeEventListener("resize", this.onResize);
	}

}
customElements.define("ui-unsafe-content", UnsafeContent);