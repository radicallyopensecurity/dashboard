import { LitElement, html, css } from '../../web_modules/lit-element.js';

class Accordion extends LitElement {

	constructor() {
		super();
		this.items = [];
	}

	static get properties() {
		return {
			items: {
				type: Array,
				notify: true
			}
		}
	}

	get onClickButton() {
		return (e) => {
			const $button = e.target;
			const $item = $button.parentElement.parentElement;

			if ($button.classList.contains("collapsed")) {
				$button.classList.remove("collapsed");
				$item.classList.remove("content-hidden");
			} else {
				$button.classList.add("collapsed");
				$item.classList.add("content-hidden");
			}
		};
	}

	static get styles() {
		return css`
		.content {
			overflow: hidden;
			transition: max-height 0.3s ease;
		}

		.content iframe {
			width: 100%;
		}

		.content-hidden .content {
			max-height: 0px !important;
		}

		.accordion-button * {
			pointer-events: none;
		}
		`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div class="accordion mb-3">
			${this.items.map((item) => html`
				<div class="accordion-item content-hidden">
					<h2 class="accordion-header">
						<button @click="${this.onClickButton}" class="accordion-button collapsed">${item.title}</button>
					</h2>
					<div class="accordion-collapse content">
						<div class="accordion-body pb-0">${item.content}</div>
					</div>
				</div>
			`)}
		</div>
		`;
	}

}
customElements.define("ui-accordion", Accordion);