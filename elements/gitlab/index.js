import moment from '../../web_modules/moment.js';
import { LitElement } from '../../web_modules/lit-element.js';

export class Gitlab extends LitElement {

	constructor() {
		super();
		this.params = {};
		this.perPage = 50;
		this.maxPages = undefined;
	}

	get baseUrl() {
		return "/api/v4/"
	}

	static get properties() {
		return {
			params: {
				type: Object,
				notify: true
			},
			perPage: {
				type: Number,
				notify: true
			},
			maxPages: {
				type: Number,
				notify: true
			}
		}
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

	async fetchPaginated(key, url) {
		const _url = this.getUrl(url, this.params);

		let nextPage = 1;
		this[key] = [];

		_url.searchParams.set("per_page", this.perPage);

		let response;
		let numberOfPagesFetched = 0;
		while (!Number.isNaN(nextPage) && this.maxPages !== numberOfPagesFetched) {
			_url.searchParams.set("page", nextPage);
			response = await fetch(_url);
			nextPage = parseInt(response.headers.get("x-next-page"), 10);
			numberOfPagesFetched = parseInt(response.headers.get("x-page"), 10);
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
	}

	connectedCallback() {
		super.connectedCallback()
		this.fetch();
	}

	static get properties() {
		return {
			... super.properties,
			projects: {
				type: Array
			},
			loading: {
				type: Boolean
			}
		}
	}

	debounce(func, delay = 0) {
		let timeoutId;
		return function() {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func.apply(this, arguments);
			}, delay);
		}
	};

	debouncedSearch = this.debounce(this.fetch, 500);

	updated(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("params") ) {
			console.log(this.params.search);
			this.debouncedSearch();
		}
	}

	get baseUrl() {
		return super.baseUrl + `projects`;
	}

	async fetch() {
		this.loading = true;
		await super.fetchPaginated("projects", this.baseUrl);
		this.loading = false;
	}

}
