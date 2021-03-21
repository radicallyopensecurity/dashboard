import moment from '../../../web_modules/moment.js';
import { LitElement, html, css } from '../../../web_modules/lit-element.js';

export class ProjectRecentIssues extends LitElement {

	constructor() {
		super();
		this.finding = null;
		this.project = null;
	}

	static get properties() {
		return {
			finding: {
				type: Object
			},
			project: {
				type: Object
			}
		};
	}

	render() {
		if (!this.finding) {
			return html``;
		}

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div class="d-flex text-muted pt-3 border-bottom">
			<div class="d-flex justify-content-between w-100">
				<p class="pb-3 mb-0">
					<strong class="d-block text-gray-dark"><a href="${this.project.web_url}/issues/${this.finding.iid}" target="_blank">
						${this.finding.title} - #${this.finding.iid}</a></strong>
					${this.finding.description}
				</p>
				<small>${moment(this.finding.updated_at).fromNow()}</small>
			</div>
		</div>
		`;
	}

}
customElements.define("ros-project-recent-issues", ProjectRecentIssues);