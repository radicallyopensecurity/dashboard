import marked from '../../lib/marked.js';
import { LitElement, html } from '../../web_modules/lit-element.js';
import { GitlabIssue } from '../gitlab/issue.js';
import '../ros/ui/unsafe-finding-content.js';

export class Finding extends GitlabIssue {

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

	get technicalDescription() {
		const issueDiscussionComments = this.gitlabIssueComments;
		if (!issueDiscussionComments || !issueDiscussionComments.length) {
			return "ToDo";
		}
		return issueDiscussionComments[0].notes[0].body;
	}

	_findIssueComment(topic) {
		const issueDiscussionComments = this.gitlabIssueComments
			.filter((comment) => comment.notes[0].body.toLowerCase().startsWith(topic.toLowerCase()));

		if (!issueDiscussionComments || !issueDiscussionComments.length) {
			return "ToDo";
		}

		const lines = issueDiscussionComments[0].notes[0].body
			.split("\n")
			.filter((line) => !line.match(/^\s*$/)); // remove empty lines

		lines.shift();
		return lines.join("\n");
	}

	get recommendation() {
		return this._findIssueComment("recommendation");
	}

	get impact() {
		return this._findIssueComment("impact");
	}

	render() {

		if (!this.fetched || !this.gitlabIssueData) {
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
		const technicalDescription = marked(this.technicalDescription, { gfm: true });
		const impact = marked(this.impact, { gfm: true });
		const recommendation = marked(this.recommendation, { gfm: true });

		const body = `
			${description}

			<h2>Technical Description</h2>
			${technicalDescription}

			<h2>Impact</h2>
			${impact}

			<h2>Recommendation</h2>
			${recommendation}
		`;

		const finding = document.createElement("ros-ui-unsafe-finding-content");
		finding.baseUrl = this.gitlabProjectFullPath;
		finding.unsafeHTML = body;

		return html`${finding}`;
	}

}

customElements.define("ros-finding", Finding);
