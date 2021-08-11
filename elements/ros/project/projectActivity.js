import moment from '../../../web_modules/moment.js';
import { LitElement, html, css } from '../../../web_modules/lit.js';

export class ProjectActivity extends LitElement {

	constructor() {
		super();
		this.data = null;
		this.project = "";
	}

	static get properties() {
		return {
			data: {
				type: Object
			},
			project: {
				type: Object
			},
			dateFormat: {
				type: String
			}
		};
	}

	render() {
		if (!this.data) {
			return html``;
		}

		const created_at = new Date(this.data.created_at);

		let $message;
		switch (this.data.action_name) {
			case "pushed to":
				$message = html`pushed <a href="${this.project.web_url}/compare/${this.data.push_data.commit_from}...${this.data.push_data.commit_to}" target="_blank">${this.data.push_data.commit_count} commits</a>: ${this.data.push_data.commit_title}`;
				break;
			case "opened":
			case "closed":
			case "updated":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.target_iid}"><b>#${this.data.target_iid}</b> ${this.data.target_title}</a>`;
				break;
			case "commented on":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}" target="_blank">${this.data.target_title} (#${this.data.target_iid})</a>`;
				break;
			case "created":
				$message = html`created the project`;
				break;
			default:
				$message = html`${this.data.action_name}`;
				break;
		}

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div class="d-flex mb-1 mt-3">
			<a href="/${this.data.author.username}" target="_blank"><gitlab-avatar class="me-2" .user="${this.data.author}"></gitlab-avatar></a>
			<div class="d-flex justify-content-between w-100">
				<p class="mb-0 small lh-sm">
					<strong class="d-block text-gray-dark">${this.data.author.name}</strong>
					${$message}
				</p>
				<small>${moment(created_at).format("HH:mm")}</small>
			</div>
		</div>
		`;


	}

}
customElements.define("ros-project-activity", ProjectActivity);