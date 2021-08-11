import { LitElement, svg, css } from '../../web_modules/lit.js';

class FeatherIcon extends LitElement {

	constructor() {
		super();
		this.icon = undefined;
		this.width = 16;
		this.height = 16;
	}

	static get properties() {
		return {
			icon: {
				type: String,
				notify: true
			},
			width: {
				type: Number
			},
			height: {
				type: Number
			}
		}
	}

	static get styles() {
		return css`
		.feather {
			vertical-align: text-bottom;
		}`;
	}

	render() {
		return svg`
		<svg class="feather"
			width="${`${this.width}px`}"
			height="${`${this.height}px`}"
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