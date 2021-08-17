import { Gitlab } from './index.js';
import { LitNotify } from '../../lib/lit-element-notify.js';

export class GitlabProjects extends LitNotify(Gitlab) {

	constructor() {
		super();
		this.projects = [];
	}

	static get autofetch() {
		return true;
	}

	connectedCallback() {
		super.connectedCallback()
		if (this.constructor.autofetch) {
			this.fetch();
		}
	}

	static get properties() {
		return {
			... super.properties,
			projects: {
				type: Array,
				notify: true
			},
			sort: {
				type: String,
				reflect: true
			}
		};
	}

	static sortProjectsByLastActivity(a, b) {
		if (a.lastProjectActivity.isBefore(b.lastProjectActivity)) {
			return 1;
		} else if (b.lastProjectActivity.isBefore(a.lastProjectActivity)) {
			return -1;
		} else {
			return 0;
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

	static mapProjects(projects) {
		return projects;
	}

	static filterProjects(projects) {
		return projects;
	}

	async fetch() {
		await super.fetchPaginated(
			"projects",
			this.baseUrl,
			this.constructor.mapProjects,
			this.constructor.filterProjects
		);
	}

}
