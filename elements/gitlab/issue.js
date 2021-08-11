import { Gitlab } from './index.js';

export class GitlabIssue extends Gitlab {

	constructor() {
		super();
		this.gitlabProjectId = null;
		this.gitlabIssueIid = null;
		this.gitlabIssueData = null;
		this.gitlabIssueDiscussion = [];
	}

	static get properties() {
		return {
			gitlabProjectId: {
				type: Number,
				reflect: true
			},
			gitlabIssueIid: {
				type: Number,
				reflect: true
			},
			gitlabIssueData: {
				type: Object,
				reflect: false
			},
			gitlabIssueDiscussion: {
				type: Object,
				notify: true
			}
		};
	}

	get gitlabIssueComments() {
		return this.gitlabIssueDiscussion
			.filter((item) => item.notes[0].system === false);
	}

	get labels() {
		return this.gitlabProjectData ? this.gitlabProjectData.labels : [];
	}

	async updated(changedProperties) {
		if (changedProperties.has("gitlabProjectId")) {
			await this.fetch();
		}
	}

	get baseUrl() {
		if (this.gitlabProjectId === null) {
			throw new Error("Gitlab Project ID undefined");
		}
		return super.baseUrl + `projects/${this.gitlabProjectId}/issues/${this.gitlabIssueIid}`;
	}

	async fetch() {
		if (this.gitlabProjectId == null) {
			return;
		}
		if (!this.gitlabIssueData || (this.gitlabIssueIid !== this.gitlabIssueData.iid)) {
			// load gitlabIssueData
			this.gitlabIssueData = await super.fetch();
		}
		await this.fetchPaginated("gitlabIssueDiscussion", `${this.baseUrl}/discussions`);
	}

}
