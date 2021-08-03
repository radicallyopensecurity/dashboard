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

		console.log(url, response.status);
		if ((response.status < 200) || (response.status >= 300)) {

			let message = `HTTP Error ${response.status}`;
			switch (response.status) {
				case 400:
					message += `: ${data}`
					break;
				case 401:
					const sign_in_url = "/users/sign_in?redirect_to_referer=yes";
					message += `Redirecting to ${sign_in_url}`;
					console.log(message);
					window.location.href = sign_in_url;
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
