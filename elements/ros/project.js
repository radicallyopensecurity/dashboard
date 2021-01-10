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
			background-color: lightgrey;
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
				$message = html`pushed <a href="${this.project.web_url}/compare/${this.data.push_data.commit_from}...${this.data.push_data.commit_to}">${this.data.push_data.commit_count} commits</a>: ${this.data.push_data.commit_title}`;
				break;
			case "opened":
			case "updated":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.target_iid}"><b>#${this.data.target_iid}</b> ${this.data.target_title}</a>`;
				break;
			case "commented on":
				$message = html`<a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}">${this.data.action_name}</a> ${this.data.target_title} (<a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}">#${this.data.target_iid}</a>)`;
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
		if (this.gitlabProjectData.name.startsWith("pen-"))
		return this.gitlabProjectData.name.substr(4);
	}

	get findings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.includes("finding"));
	}

	get nonFindings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.includes("non-finding"));
	}

	static get severities() {
		return [
			"ToDo",
			"Extreme",
			"High",
			"Elevated",
			"Moderate",
			"Low",
			"Unknown"
		];
	}

	get findingsBySeverity() {
		const output = {};
		const threadLevelPrefix = "threatLevel:";
		this.findings.forEach((finding) => {
			let severity = "ToDo";
			for (let label of finding.labels) {
				if (label.startsWith(threadLevelPrefix)) {
					severity = label.substr(threadLevelPrefix.length);
					break;
				}
			}
			if (!output.hasOwnProperty(severity)) {
				output[severity] = [];
			}
			output[severity].push(finding);
		});

		const orderedOutput = {};
		this.constructor.severities.forEach((severity) => {
			if (output.hasOwnProperty(severity)) {
				orderedOutput[severity] = output[severity];
			}
		});

		return orderedOutput;
	}

	render() {
		if (this.gitlabProjectData === null) {
			return html`loading ${this.gitlabProjectId}...`;
		}

		const findings = this.findings;
		const nonFindings = this.nonFindings;

		return html`
		<link rel="stylesheet" href="flexboxgrid.css" />
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<h1>${this.title}</h1>
					<ul>
						<li>${findings.length} finding${(findings.length === 1) ? "" : "s"}</li>
						<li>${nonFindings.length} non-finding${(nonFindings.length === 1) ? "" : "s"}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<div class="row">
						<div class="col-xs-12">
							<h2>Event History</h2>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-11">
							${this.gitlabProjectEvents.map((eventData) => html`
								<ros-project-event .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-event>
							`)}
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-md-6">
					<div class="row">
						<div class="col-xs-12">
							<h2>Findings</h2>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-11">
							${Object.entries(this.findingsBySeverity).map(([severity, findings]) => html`
								<h3>${severity}</h3>
								<ul>
									${findings.map((finding) => {
										return html`<li>${finding.title} (<a href="${this.gitlabProjectData.web_url}/issues/${finding.iid}">#${finding.iid}</a>)</li>`;
									})}
								</ul>
							`)}
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);