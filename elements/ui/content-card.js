import { LitElement, html } from '../../web_modules/lit-element.js';

class ContentCard extends LitElement {

	constructor() {
		super();
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div class="p-3 mb-3 bg-body rounded shadow-sm"><slot></slot></div>
		`;
	}

}
customElements.define("ui-content-card", ContentCard);