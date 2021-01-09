import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';

class GitLab extends LitElement {

	get baseUrl() {
		return "/api/v4/"
	}

	getUrl(url, params) {
		params = params || {};
		url = url || this.baseUrl;
		const _url = new URL(url, window.location.href);
		Object.entries(params || {}).forEach(([key, value]) => url.searchParams.append(key, params[key]))
		return _url;
	}

	async fetch(url, params) {
		const _url = this.getUrl(url, params);
		const response = await fetch(_url)
			.then((response) => response.json());
		return response;
	}

	async fetchPaginated(key, url, params) {
		const _url = this.getUrl(url, params);

		let nextPage = 1;
		const perPage = 50;
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

class GitLabProject extends GitLab {

	constructor() {
		super();
		this.gitLabProjectData = null;
		this.gitLabProjectEvents = [];
		this.gitlabProjectId = null;
	}

	static get properties() {
		return {
			gitlabProjectId: {
				type: Number,
				reflect: true
			},
			gitLabProjectData: {
				type: Object,
				notify: true
			},
			gitlabProjectEvents: {
				type: Object,
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
		this.gitLabProjectData = await super.fetch();
		await this.fetchPaginated("gitlabProjectEvents", `${this.baseUrl}/events?target=issue`);
	}

}

export class ProjectEvent extends LitElement {

	constructor() {
		super();
		this.data = null;
		this.project = "";
	}

	static get properties() {
		return {
			data: {
				type: Object
			},
			project: {
				type: Object
			}
		};
	}

	static get styles() {
		return css`
		:host {
			--line-height: 24px;
			line-height: var(--line-height);
			margin-bottom: 10px;
			display: block;
		}
		.avatar {
			position: relative;
			background-repeat: no-repeat;
			background-size: cover;
			width: var(--line-height);
			height: var(--line-height);
			float: left;
			margin-right: 1em;
		}
		.avatar.default {
			background-color: grey;
			border-radius: calc(var(--line-height) / 2);
		}
		`;
	}

	render() {
		if (!this.data) {
			return html``;
		}

		const $avatar = document.createElement("div");
		$avatar.classList.add("avatar");
		if (this.data.author.avatar_url != undefined) {
			$avatar.style.backgroundImage = `url(${new URL(this.data.author.avatar_url)})`;
		} else {
			$avatar.classList.add("default");
		}

		const created_at = new Date(this.data.created_at);

		let $message;
		switch (this.data.action_name) {
			case "pushed to":
				$message = html`pushed <b>${this.data.push_data.commit_title}</b>`;
				break;
			case "opened":
			case "updated":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.target_iid}"><b>#${this.data.target_iid}</b> ${this.data.target_title}</a>`;
				break;
			case "commented on":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}">${this.data.target_title} (<b>#${this.data.target_iid}</b>)</a>`;
				break;
			case "created":
				$message = html`created the project`;
				break;
			default:
				$message = html`${this.data.action_name}`;
				break;
		}

		return html`
		${$avatar} ${this.data.author.name}
		${$message}
		${moment(created_at).fromNow()}
		`;
	}

}
customElements.define("ros-project-event", ProjectEvent);

export class Project extends GitLabProject {

	get title() {
		if (this.gitLabProjectData.name.startsWith("pen-"))
		return this.gitLabProjectData.name.substr(4);
	}

	get findings() {
		return [];
	}

	render() {
		if (this.gitLabProjectData === null) {
			return html`loading ${this.gitlabProjectId}...`;
		}

		return html`
		<link rel="stylesheet" href="flexboxgrid.css" />
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<h1>${this.title}</h1>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<h2>Timeline</h2>
				</div>
			</div>
			<div class="row">
				${this.gitlabProjectEvents.map((eventData) => html`
					<div class="col-xs-11">
						<ros-project-event .data="${eventData}" .project="${this.gitLabProjectData}"></ros-project-event>
					</div>
				`)}
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);