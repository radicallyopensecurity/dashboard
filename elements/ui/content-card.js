import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';
import { styleMap } from '../../web_modules/lit-html/directives/style-map.js';

class ContentCard extends LitElement {

	constructor() {
		super();
		this.resize = "none";
		this.height = "auto";
		this.seamless = false;
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
			},
			seamless: {
				type: Boolean
			}
		}
	}

	get cardStyles() {
		return styleMap({
			"resize": this.resize,
			"height": this.height
		});
	}

	get cardClasses() {
		const extraClasses = {};
		if (!this.seamless) {
			extraClasses["p-3"] = true;
		}
		return classMap({
			...extraClasses,
			"mb-3": true,
			"bg-body": true,
			"rounded": true,
			"shadow-sm": true
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
		<div id="card" class="${this.cardClasses}" style="${this.cardStyles}">
			<slot></slot>
		</div>
		`;
	}

}
customElements.define("ui-content-card", ContentCard);