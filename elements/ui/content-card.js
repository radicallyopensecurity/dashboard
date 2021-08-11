import { LitElement, html, css } from '../../web_modules/lit.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';
import { styleMap } from '../../web_modules/lit-html/directives/style-map.js';

export class ContentCard extends LitElement {

	constructor() {
		super();
		this.resize = "none";
		this.height = "auto";
		this.seamless = false;
		this.cardClasses = "";
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
			"height": this.height !== "auto"
		});
	}

	get _cardClasses() {
		const extraClasses = {};
		if (!this.seamless) {
			extraClasses["p-3"] = true;
		}
		return classMap({
			...extraClasses,
			"mb-0": true,
			"mb-sm-3": true,
			"bg-body": true,
			"rounded": true,
			"shadow-sm": true
		});
	}

	static get styles() {
		return css`
		#card {
			overflow: auto;
			height: auto;
		}

		:host {
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}
		`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div id="card" class="${this._cardClasses}" style="${this.cardStyles}">
			<slot></slot>
		</div>
		`;
	}

}
customElements.define("ui-content-card", ContentCard);