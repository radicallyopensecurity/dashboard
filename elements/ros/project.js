import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProject } from '../gitlab/index.js';
import '../gitlab/avatar.js';
import '../pdf-password.js';
import '../ui/icon.js';

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
			case "closed":
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
			<a href="/${this.data.author.username}" target="_blank"><gitlab-avatar .user="${this.data.author}"></gitlab-avatar></a>
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
		// if (this.gitlabProjectData.name.startsWith("pen-")) {
		// 	return this.gitlabProjectData.name.substr(4);
		// }
		return this.gitlabProjectData.path.substr(4);
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
		const threadLevelPrefix = "ThreatLevel:";
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

	get branchName() {
		return "main";
	}

	get _artifactDownloadUrl() {
		return `/api/v4/projects/${this.gitlabProjectId}/jobs/artifacts/${this.branchName}/raw/target/${this._assetFileName}?job=${gitlabCiJobName}`;
	}

	get _assetFileName() {
		if (this.gitlabProjectData.path.startsWith("pen-")) {
			return `report_${this.title}.pdf`;
		} else {
			return `offerte_${this.title}.pdf`
		}
	}

	get pdfPassword() {
		if (this.gitlabProjectVariables instanceof Array) {
			const match = this.gitlabProjectVariables
				.filter((data) => data.key.toUpperCase() === "PDF_PASSWORD");
			if (match.length === 1) {
				return match[0].value;
			}
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
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="container-fluid">
			<div class="row">
				<nav id="sidebarMenu" class="col-md-3 col-xl-2 d-md-block bg-light sidebar collapse">
					<div class="position-sticky pt-3">
						<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
							<span>Cross links</span>
						</h6>
						<ul class="nav flex-column">
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="https://chat.radicallyopensecurity.com/group/${this.gitlabProjectData.path}" target="_blank">
									<ui-icon icon="message-square"></ui-icon>
									Channel
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="${this.gitlabProjectData.web_url}" target="_blank">
									<ui-icon icon="gitlab"></ui-icon>
									Repository
								</a>
							</li>
						</ul>
					</div>
				</nav>
				 
				<main class="col-md-9 col-xl-10 ms-sm-auto px-md-4">
					<div class="w-100 pt-3">
						<nav aria-label="breadcrumb mb-1">
							<ol class="breadcrumb">
								<li class="breadcrumb-item"><a href=".">Projects</a></li>
								<li class="breadcrumb-item"><a href="https://git.staging.radical.sexy/groups/ros" target="_blank">${this.gitlabProjectData.namespace.name}</a></li>
								<li class="breadcrumb-item active" aria-current="page">${this.gitlabProjectData.name}</li>
							</ol>
						</nav>
					</div>
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
						<h1>${this.gitlabProjectData.name}</h1>
						<div class="btn-toolbar mb-2 mb-md-0">
							<div class="input-group me-2">
								<a class="btn btn-outline-secondary bg-primary text-white" title="${this._assetFileName}" href="${this._artifactDownloadUrl}">
									Report
									<ui-icon icon="file-text"></ui-icon>
								</a>
								${!!this.pdfPassword ? html`<span class="input-group-text"><pdf-password cleartext="${this.pdfPassword}"></pdf-password></span>` : ``}
							</div>
						</div>
					</div>
					
					<div class="row">
						<div class="col-12 mb-3">
							<ul class="list-group list-group-horizontal">
								<li class="list-group-item active" aria-current="true">${findings.length} finding${(findings.length === 1) ? "" : "s"}</li>
								<li class="list-group-item bg-secondary text-white">${nonFindings.length} non-finding${(nonFindings.length === 1) ? "" : "s"}</li>
							</ul>
						</div>
						<div class="col-12 col-lg-6">
							<div class="row">
								<div class="col-11">
									<h2>Findings <span class="badge bg-primary">${findings.length}</span></h2>
									${Object.entries(this.findingsBySeverity).map(([severity, findings]) => html`
									<h4>${severity} <span class="badge bg-warning text-dark">${findings.length}</span></h4>
									<div class="list-group mb-3">
										${findings.map((finding) => {
										return html`
											<a href="${this.gitlabProjectData.web_url}/issues/${finding.iid}" target="_blank" class="list-group-item list-group-item-action">
												<div class="d-flex w-100 justify-content-between">
													<h5 class="mb-1">${finding.title} - #${finding.iid}</h5>
													<small>${moment(finding.updated_at).fromNow()} <ui-icon icon="edit"></ui-icon></small>
												</div>
												<p class="mb-1">${finding.description} </p>
												<small>Created at: ${moment(finding.created_at).calendar()}</small>
											</a>
										`;
									})}
									</div>
								`)}
								</div>
							</div>
							<div class="row">
								<div class="col-11">
									<h2>Non-Findings <span class="badge bg-secondary">${nonFindings.length}</span></h2>
									<div class="list-group">
										${this.nonFindings.map((nonFinding) => html`
											<a href="${this.gitlabProjectData.web_url}/issues/${nonFinding.iid}" target="_blank" class="list-group-item list-group-item-action">
												<div class="d-flex w-100 justify-content-between">
													<h5 class="mb-1">${nonFinding.title} - #${nonFinding.iid}</h5>
													<small>${moment(nonFinding.updated_at).fromNow()} <ui-icon icon="edit"></ui-icon></small>
												</div>
												<p class="mb-1">${nonFinding.description}</p>
												<small>Created at: ${moment(nonFinding.created_at).calendar()}</small>
											</a>`)}
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-lg-6">
							<div class="row">
								<div class="col-12 mb-4">
									<h2>Recent Activity</h2>
									${this.gitlabProjectEvents.slice(0, 5).map((eventData) => html`
									<ros-project-activity .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-event>
								`)}
								</div>
								<div class="col-12">
									<h2>Event History</h2>
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

						
					</div>
				</main>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);