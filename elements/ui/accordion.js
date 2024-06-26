import { LitElement, html, css } from '../../web_modules/lit.js';
import { repeat } from '../../web_modules/lit-html/directives/repeat.js';

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

			const $content = $item.querySelector(".content");
			const $body = $content.querySelector(".accordion-body");

			if ($button.classList.contains("collapsed")) {
				$button.classList.remove("collapsed");
				$item.classList.remove("content-hidden");
			} else {
				$button.classList.add("collapsed");
				$item.classList.add("content-hidden");
			}

			const $contentElement = $item.querySelector(".content > .accordion-body > *");
			if ($contentElement.onBecomeVisible && !$button.classList.contains("collapsed")) {
				$contentElement.onBecomeVisible();
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
			${repeat(this.items, (item) => (item.id || item), (item) => html`
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