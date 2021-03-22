import { LitElement, html, css, svg } from '../../web_modules/lit-element.js';

class FeatherIcon extends LitElement {

	constructor() {
		super();
		this.icon = undefined;
	}

	static get properties() {
		return {
			icon: {
				type: String,
				notify: true
			}
		}
	}

	render() {
		return svg`
		<svg class="feather"
			width="24px"
			height="24px"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			fill="none"
		>
			<use href="node_modules/feather-icons/dist/feather-sprite.svg#${this.icon}"/>
		</svg>
		`
	}

	createRenderRoot() {
		return this;
	}

}
customElements.define("ui-icon", FeatherIcon);