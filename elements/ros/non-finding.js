import marked from '../../lib/marked.js';
import { LitElement, html } from '../../web_modules/lit.js';
import { GitlabIssue } from '../gitlab/issue.js';
import '../ros/ui/unsafe-finding-content.js';

export class NonFinding extends GitlabIssue {

	static get properties() {
		return {
			...super.properties,
			gitlabProjectFullPath: {
				type: String
			}
		};
	}

	get title() {
		this.gitlabIssueData.title;
	}

	get iid() {
		return this.gitlabIssueIid;
	}

	get description() {
		return this.gitlabIssueData.description;
	}

	render() {

		if (!this.gitlabIssueData) {
			return html`
				<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
				<div class="d-flex justify-content-center">
					<div class="spinner-border mb-3" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			`;
		}

		const description = marked(this.description, { gfm: true });
		const nonFinding = document.createElement("ros-ui-unsafe-finding-content");
		nonFinding.baseUrl = this.gitlabProjectFullPath;
		nonFinding.unsafeHTML = description;

		return html`${nonFinding}`;
	}

}

customElements.define("ros-non-finding", NonFinding);
