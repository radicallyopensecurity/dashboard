import { LitElement, html, css } from '../web_modules/lit.js';
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

	get copyToClipboard() {
		return (e) => {
			console.log("copy to clipboard")
			var data = [
				new ClipboardItem({
					"text/plain": new Blob(
						[this.cleartext],
						{
							type: "text/plain"
						}
					)
				})
			];
			navigator.clipboard.write(data);

			const tooltip = new bootstrap.Tooltip(e.currentTarget, {
				placement: "right",
				title: "copied",
				trigger: ""
			});
			tooltip.show();
			setTimeout(() => {
				tooltip.dispose();
			}, 400);
		}
	}

	render() {
		const toggleVisible = () => {
			this.visible = !this.visible;
		}
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>
		<code @click="${this.copyToClipboard}">${this.preview}</code>
		<button class="p-0 ms-1 link-dark border-0" @click="${toggleVisible}">
			
		${this.visible ? html`<ui-icon icon="eye-off"></ui-icon>` : html`<ui-icon icon="eye"></ui-icon>`}</button>
		`;
	}

}

customElements.define("pdf-password", PDFPassword);
