import { Gitlab } from './index.js';

export class GitlabProject extends Gitlab {

	constructor() {
		super();
		this.gitlabProjectData = null;
		this.gitlabProjectEvents = [];
		this.gitlabProjectLabels = [];
		this.gitlabProjectIssues = [];
		this.gitlabProjectMembers = [];
	}

	static get properties() {
		return {
			gitlabProjectId: {
				type: Number,
				reflect: true
			},
			gitlabProjectData: {
				type: Object,
				notify: true
			},
			gitlabProjectEvents: {
				type: Array,
				notify: true
			},
			gitlabProjectLabels: {
				type: Array,
				notify: true
			},
			gitlabProjectMembers: {
				type: Array,
				notify: true
			},
			gitlabProjectVariables: {
				type: Array,
				notify: true
			},

			gitlabProjectIssues: {
				type: Array,
				notify: true
			}
		}
	}

	async updated(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectId")) {
			await this.fetch();
		}
	}

	get baseUrl() {
		if (this.gitlabProjectId === null) {
			throw new Error("Gitlab Project ID undefined");
		}
		return super.baseUrl + `projects/${this.gitlabProjectId}`;
	}

	async fetch() {
		if (this.gitlabProjectId == null) {
			return;
		}
		this.gitlabProjectData = await super.fetch();
		await this.fetchPaginated("gitlabProjectMembers", `${this.baseUrl}/members`);
		await this.fetchPaginated("gitlabProjectLabels", `${this.baseUrl}/labels`);
		await this.fetchPaginated("gitlabProjectIssues", `${this.baseUrl}/issues`);
		await this.fetchPaginated("gitlabProjectEvents", `${this.baseUrl}/events?target=issue`);

		await this.fetchPaginated("gitlabProjectVariables", `${this.baseUrl}/variables`);
	}

}
