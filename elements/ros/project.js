import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProject } from '../gitlab/index.js';
import '../gitlab/avatar.js';

const gitlabCiJobName = "build";

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
				type: Object,
				notify: true
			},
			dateFormat: {
				type: String
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
		`;
	}

	render() {
		if (!this.data) {
			return html``;
		}

		const created_at = new Date(this.data.created_at);

		let $message;
		switch (this.data.action_name) {
			case "pushed to":
				$message = html`pushed <a href="${this.project.web_url}/compare/${this.data.push_data.commit_from}...${this.data.push_data.commit_to}" target="_blank">${this.data.push_data.commit_count} commits</a>: ${this.data.push_data.commit_title}`;
				break;
			case "opened":
			case "updated":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.target_iid}"><b>#${this.data.target_iid}</b> ${this.data.target_title}</a>`;
				break;
			case "commented on":
				$message = html`<a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}" target="_blank">${this.data.action_name}</a> ${this.data.target_title} (<a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}" target="_blank">#${this.data.target_iid}</a>)`;
				break;
			case "created":
				$message = html`created the project`;
				break;
			case "left":
			case "joined":
				$message = html`<a href="/${this.data.author.username}" target="_blank">
					<gitlab-avatar .user="${this.data.author}"></gitlab-avatar>
					${this.data.author.name}</a> ${this.data.action_name}`;
				break;
			default:
				$message = html`${this.data.action_name}`;
				break;
		}

		return html`
		<link rel="stylesheet" href="style.css"/>
		${$message}
		on ${moment(created_at).format("HH:mm")}
		`;
	}

}
customElements.define("ros-project-event", ProjectEvent);

export class ProjectActivity extends LitElement {

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
			},
			dateFormat: {
				type: String
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
		`;
	}

	render() {
		if (!this.data) {
			return html``;
		}

		const created_at = new Date(this.data.created_at);

		let $message;
		switch (this.data.action_name) {
			case "pushed to":
				$message = html`pushed <a href="${this.project.web_url}/compare/${this.data.push_data.commit_from}...${this.data.push_data.commit_to}" target="_blank">${this.data.push_data.commit_count} commits</a>: ${this.data.push_data.commit_title}`;
				break;
			case "opened":
			case "updated":
				$message = html`${this.data.action_name} <a href="${this.project.web_url}/issues/${this.data.target_iid}"><b>#${this.data.target_iid}</b> ${this.data.target_title}</a>`;
				break;
			case "commented on":
				$message = html`<a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}" target="_blank">${this.data.action_name}</a> ${this.data.target_title} (<a href="${this.project.web_url}/issues/${this.data.note.noteable_iid}#node_${this.data.target_id}" target="_blank">#${this.data.target_iid}</a>)`;
				break;
			case "created":
				$message = html`created the project`;
				break;
			default:
				$message = html`${this.data.action_name}`;
				break;
		}

		return html`
		<link rel="stylesheet" href="style.css"/>
		<span class="author">
			<a href="/${this.data.author.username}" target="_blank">
				<gitlab-avatar .user="${this.data.author}"></gitlab-avatar>
			</a>
			${this.data.author.name}
		</span>
		${$message}
		${moment(created_at).fromNow()}
		`;
	}

}
customElements.define("ros-project-activity", ProjectActivity);

export class Project extends GitlabProject {

	get title() {
		if (this.gitlabProjectData.name.startsWith("pen-"))
		return this.gitlabProjectData.name.substr(4);
	}

	get findings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "finding"));
	}

	get nonFindings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "non-finding"));
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

	get eventsByDay() {
		const out = {};
		this.gitlabProjectEvents.forEach((event) => {
			const date = event.created_at;
			const key = moment(date).format("YYYY-MM-DD");
			if (!out.hasOwnProperty(key)) {
				out[key] = [];
			}
			out[key].push(event);
		});
		return out;
	}

	get _artifactDownloadUrl() {
		return `/api/v4/projects/${this.gitlabProjectId}/jobs/artifacts/master/raw/target/${this._assetFileName}?job=${gitlabCiJobName}`;
	}

	get _assetFileName() {
		if (this.gitlabProjectData.name.startsWith("pen-")) {
			return `report_${this.title}.pdf`;
		} else {
			return `offerte_${this.title}.pdf`
		}
	}

	get pdfPassword() {
		if (this.gitlabProjectVariables instanceof Array) {
			return this.gitlabProjectVariables.PDF_PASSWORD;
		}
	}

	render() {
		if (this.gitlabProjectData === null) {
			return html`loading ${this.gitlabProjectId}...`;
		}

		const findings = this.findings;
		const nonFindings = this.nonFindings;

		return html`
		<link rel="stylesheet" href="style.css"/>
		<link rel="stylesheet" href="flexboxgrid.css" />
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<h1>${this.title}</h1>
					<ul>
						<li>${findings.length} finding${(findings.length === 1) ? "" : "s"}</li>
						<li>${nonFindings.length} non-finding${(nonFindings.length === 1) ? "" : "s"}</li>
					</ul>
					<p>
						Download: <a href="${this._artifactDownloadUrl}">${this._assetFileName}</a>
						${!!this.pdfPassword ? html`(Password: <code>${this.pdfPassword}</code>` : ``}
					</p>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<div class="row">
						<div class="col-xs-12">
							<h2>Recent Activity</h2>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-11">
							${this.gitlabProjectEvents.slice(0, 5).map((eventData) => html`
								<ros-project-activity .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-event>
							`)}
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<h2>Event History</h2>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-11">
							${Object.entries(this.eventsByDay).map(([day, events]) => {
								return html`
									<h3>${moment(day).format("dddd, DD.MM.YYYY")}</h3>
									${events.map((eventData) => html`
										<ros-project-event .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-event>
									`)}
								`;
							})}
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
										return html`<li>${finding.title} (<a href="${this.gitlabProjectData.web_url}/issues/${finding.iid}" target="_blank">#${finding.iid}</a>)</li>`;
									})}
								</ul>
							`)}
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<h2>Non-Findings</h2>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-11">
							<ul>
								${this.nonFindings.map((nonFinding) => html`
									<li>${nonFinding.title} (<a href="${this.gitlabProjectData.web_url}/issues/${nonFinding.iid}" target="_blank">#${nonFinding.iid}</a>)</li>
								`)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);