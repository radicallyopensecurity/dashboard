import { LitElement, html } from '../../web_modules/lit.js';

class Breadcrumbs extends LitElement {

	constructor() {
		super();
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<nav aria-label="breadcrumb" class="d-flex">
			<ol class="breadcrumb mb-3 mb-sm-2">
				${Array.prototype.filter.call(this.childNodes, (el) => el.nodeType == Node.ELEMENT_NODE).map((crumb, i, arr) => {
					const classes = ["breadcrumb-item"];
					if ((i + 1) === arr.length) {
						classes.push("active");
					}
					return html`<li class="${classes.join(" ")}">${crumb}</li>`;
				})}
			</ol>
		</nav>
		`;
	}

}
customElements.define("ui-breadcrumbs", Breadcrumbs);