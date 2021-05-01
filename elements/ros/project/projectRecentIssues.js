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
		<div class="d-flex pt-3">
			<div class="d-flex justify-content-between w-100">
				<span>
					<span style="width: 3ch;" class="d-inline-block text-center small me-1">${this.finding.iid}</span>
					<span class="finding-title">
						<a href="${this.project.web_url}/issues/${this.finding.iid}" target="_blank">
							${this.finding.title}
						</a>
					</span>
				</span>
				<small>${moment(this.finding.updated_at).fromNow()}</small>
			</div>
		</div>
		`;
	}

}
customElements.define("ros-project-recent-issues", ProjectRecentIssues);