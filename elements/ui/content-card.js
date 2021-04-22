import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { styleMap } from '../../web_modules/lit-html/directives/style-map.js';

class ContentCard extends LitElement {

	constructor() {
		super();
		this.resize = "none";
		this.height = "auto";
	}

	static get properties() {
		return {
			resize: {
				type: String,
				reflect: true
			},
			height: {
				type: String,
				reflect: true
			}
		}
	}

	get cardStyles() {
		return styleMap({
			"resize": this.resize,
			"height": this.height
		});
	}

	static get styles() {
		return css`
		#card {
			overflow: auto;
		}
		`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div id="card" class="p-3 mb-3 bg-body rounded shadow-sm" style="${this.cardStyles}">
			<slot></slot>
		</div>
		`;
	}

}
customElements.define("ui-content-card", ContentCard);