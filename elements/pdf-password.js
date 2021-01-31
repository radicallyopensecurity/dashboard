import { LitElement, html, css } from '../web_modules/lit-element.js';

class PDFPassword extends LitElement {

	constructor() {
		super();
		this.cleartext = "";
		this.visible = false;
	}

	static get properties() {
		return {
			cleartext: {
				type: String
			},
			visible: {
				type: Boolean
			}
		}
	}

	get preview() {
		if (this.visible) {
			return this.cleartext;
		} else {
			return "********"
		}
	}

	render() {
		const copyToClipboard = (e) => {
			var data = [new ClipboardItem({ "text/plain": new Blob([this.cleartext], { type: "text/plain" }) })];
			navigator.clipboard.write(data);
		}
		const toggleVisible = () => {
			this.visible = !this.visible;
		}
		return html`
		<link rel="stylesheet" href="style.css"/>
		<code @click="${copyToClipboard}">${this.preview}</code>
		<button @click="${toggleVisible}">👀 ${this.visible ? "hide" : "show"}</button>
		`;
	}

}

customElements.define("pdf-password", PDFPassword);
