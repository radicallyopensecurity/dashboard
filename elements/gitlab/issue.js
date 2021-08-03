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
				reflect: true
			},
			gitlabIssueDiscussion: {
				type: Object,
				notify: true
			}
		};
	}

	get labels() {
		return this.gitlabProjectData ? this.gitlabProjectData.labels : [];
	}

	async willUpdate(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectId")) {
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
		await this.fetchPaginated("gitlabProjectDiscussion", `${this.baseUrl}/discussions`);
	}

}
