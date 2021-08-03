import { Gitlab } from './index.js';

export class GitlabUsers extends Gitlab {

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
		await super.fetchPaginated("projects", this.baseUrl);
	}

}