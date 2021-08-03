import marked from '../../lib/marked.js';
import { LitElement, html } from '../../web_modules/lit-element.js';
import { GitlabIssue } from '../gitlab/issue.js';
import '../ui/unsafe-content.js';

export class Finding extends GitlabIssue {

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
		this.gitlabIssueDiscussion[0].description;
	}

	render() {

		if (!this.gitlabIssueData || !this.gitlabIssueDiscussion) {
			return html`Loading`;
		}

		const $description = document.createElement("ui-unsafe-content");
		$description.unsafeHTML = marked(this.description, { gfm: true });

		const technicalDescription = document.createElement("ui-unsafe-content");
		technicalDescription.unsafeHTML = marked(this.technicalDescription, { gfm: true });

		return html`
			${$description}

			<h2>Technical Description</h2>
			${$technicalDescription}
		`
	}

}

customElements.define("ros-finding", Finding);
