import { LitElement, html } from '../../web_modules/lit-element.js';

class UnsafeContent extends LitElement {

	constructor() {
		super();
		this.unsafeHTML = "";
		this.$iframe = null;
	}

	static get properties() {
		return {
			unsafeHTML: {
				type: String,
				notify: true
			}
		}
	}

	update(changedProperties) {
		this.$iframe.srcdoc = `
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		${this.unsafeHTML}
		`;
	}

	updateHeight = () => {
		this.$iframe.style.height = this.$iframe.contentDocument.documentElement.offsetHeight + "px";
	}

	createRenderRoot() {
		return this;
	}

	connectedCallback() {
		super.connectedCallback();
		const $iframe = document.createElement("iframe");
		this.$iframe = $iframe;
		$iframe.style.boxSizing = "content-box";
		$iframe.setAttribute("sandbox", "allow-same-origin");
		this.renderRoot.appendChild($iframe);
		$iframe.addEventListener("load", () => {
			setTimeout(() => this.updateHeight(), 0);
		})
	}

}
customElements.define("ui-unsafe-content", UnsafeContent);