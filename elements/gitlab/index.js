import moment from '../../web_modules/moment.js';
import { LitElement } from '../../web_modules/lit-element.js';

class GitlabAuth {

	constructor(token=null) {
		this._token = null;
	}

	get token() {
		if (this._token === null) {
			const userInput = prompt("This action requires administrative GitLab Authentication Token");
			if (userInput && userInput.length) {
				this._token = userInput;
			} else {
				throw new Error("Missing Gitlab Authentication Token")
			}
		}
		return this._token;
	}

	set token(value) {
		this._token = value;
	}

	get headers() {
		return {
			"PRIVATE-TOKEN": this.token
		}
	}

}
export const gitlabAuth = new GitlabAuth();

export class Gitlab extends LitElement {

	constructor() {
		super();
		this.params = {};
		this.perPage = 50;
		this.maxPages = undefined;
		this.batch = undefined;
		this.loading = false;
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
			},
			batch: {
				type: Text,
				notify: true
			},
			loading: {
				type: Boolean,
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

	async post(url, params, options={}) {
		options = {
			...options,
			method: "POST"
		}
		return await this._fetch(url, params, options);
	}

	async fetch(url, params, options) {
		return await this._fetch(url, params, options);
	}

	async _fetch(url, params, options={}) {
		const _url = this.getUrl(url, params);

		options.method = options.method || "GET";
		switch (options.method.toUpperCase()) {
			case "POST":
			case "PUT":
				options.headers = {
					...options.headers,
					...gitlabAuth.headers,
					"Content-Type": "application/json"
				};
				break;
		}

		const response = await fetch(_url, options);
		const data = await response.json();

		if (!(200 <= response.status < 300)) {

			let message = `HTTP Error ${response.status}`;
			switch (response.status) {
				case 400:
					message += `: ${data}`
					break;
			}

			throw new Error(message, {
				status: response.status
			});
		}

		return data;
	}

	async fetchPaginated(key, url) {
		const _url = this.getUrl(url, this.params);

		let nextPage = 1;
		this[key] = [];

		const currentBatch = this.batch = Symbol("paginatedRequestBatch");

		_url.searchParams.set("per_page", this.perPage);

		let response;
		let numberOfPagesFetched = 0;

		this.loading = true;
		while (!Number.isNaN(nextPage) && this.maxPages !== numberOfPagesFetched && this.batch === currentBatch) {
			_url.searchParams.set("page", nextPage);
			response = await fetch(_url);
			nextPage = parseInt(response.headers.get("x-next-page"), 10);
			numberOfPagesFetched = parseInt(response.headers.get("x-page"), 10);
			if(this.batch !== currentBatch) {
				return;
			}
			this[key] = this[key].concat(await response.json());
		}
		this.loading = false;
	}

}

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

	debouncedSearch() {
		this.debounce(this.fetch, 500);
	}

	updated(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("params")) {
			this.debouncedSearch();
		}
	}

	get baseUrl() {
		return super.baseUrl + `projects`;
	}

	async fetch() {
		await super.fetchPaginated("projects", this.baseUrl);
	}

}
