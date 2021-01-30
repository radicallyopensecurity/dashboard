import moment from '../../web_modules/moment.js';
import { LitElement } from '../../web_modules/lit-element.js';

export class Gitlab extends LitElement {

	get baseUrl() {
		return "/api/v4/"
	}

	getUrl(url, params) {
		params = params || {};
		url = url || this.baseUrl;
		const _url = new URL(url, window.location.href);
		Object.entries(params || {}).forEach(([key, value]) => _url.searchParams.append(key, params[key]));
		return _url;
	}

	async fetch(url, params) {
		const _url = this.getUrl(url, params);
		const response = await fetch(_url)
			.then((response) => response.json());
		return response;
	}

	async fetchPaginated(key, url, params, perPage) {
		const _url = this.getUrl(url, params);

		let nextPage = 1;
		perPage = perPage || 50;
		this[key] = [];

		_url.searchParams.set("per_page", perPage);

		let response;
		while (!Number.isNaN(nextPage)) {
			_url.searchParams.set("page", nextPage);
			response = await fetch(_url);
			nextPage = parseInt(response.headers.get("x-next-page"), 10);
			this[key] = this[key].concat(await response.json());
		}

	}

}

export class GitlabProject extends Gitlab {

	constructor() {
		super();
		this.gitlabProjectData = null;
		this.gitlabProjectEvents = [];
		this.gitlabProjectLabels = [];
		this.gitlabProjectIssues = [];
		
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
		await this.fetchPaginated("gitlabProjectIssues", `${this.baseUrl}/issues`);
		await this.fetchPaginated("gitlabProjectEvents", `${this.baseUrl}/events?target=issue`);
		//await this.fetchPaginated("gitlabProjectLabels", `${this.baseUrl}/labels`);
		await this.fetchPaginated("gitlabProjectVariables", `${this.baseUrl}/variables`);
	}

}

export class GitlabProjects extends Gitlab {

	constructor() {
		super();
		this.projects = [];
		this.fetch();
	}

	static get properties() {
		return {
			projects: {
				type: Array
			}
		}
	}

	get baseUrl() {
		return super.baseUrl + `projects`;
	}

	async fetch() {
		await super.fetchPaginated("projects", this.baseUrl, {
			search: "pen-",
			order_by: "last_activity_at"
		}, 10);
	}

}
