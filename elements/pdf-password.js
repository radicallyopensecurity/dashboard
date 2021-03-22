import { LitElement, html, css } from '../web_modules/lit-element.js';
import './ui/icon.js';


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

	static get styles() {
		return css`
		code {
			cursor: pointer;
		}
		code:hover{
			text-decoration: underline;
		}
		`;
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
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>
		<code @click="${copyToClipboard}">${this.preview}</code>
		<button @click="${toggleVisible}">
			
		${this.visible ? html`<ui-icon icon="eye-off"></ui-icon>` : html`<ui-icon icon="eye"></ui-icon>`}</button>
		`;
	}

}

customElements.define("pdf-password", PDFPassword);
