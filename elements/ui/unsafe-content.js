import { LitElement, html, css } from '../../web_modules/lit-element.js';

class UnsafeContent extends LitElement {

	constructor() {
		super();
		this.unsafeHTML = "";
		this.baseUrl = "";
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
		const unsafeHTML = this.unsafeHTML
			.replaceAll(/<img src="\/uploads\//gi, `<img src="${this.baseUrl}/uploads/`);

		this.$iframe.srcdoc = `
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<style>
			img {
				width: 100%;
			}
		</style>
		${unsafeHTML}
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
		$iframe.style.width = "100%";
		$iframe.style.border = "none";
		$iframe.setAttribute("sandbox", "allow-same-origin");
		this.renderRoot.appendChild($iframe);
		$iframe.addEventListener("load", () => {
			this.updateHeightInterval = setInterval(() => this.updateHeight(), 250);
		});
	}

	disconnectedCallback() {
		if (this.updateHeightInterval !== undefined) {
			clearInterval(this.updateHeightInterval);
			delete this.updateHeightInterval;
		}
	}

}
customElements.define("ui-unsafe-content", UnsafeContent);