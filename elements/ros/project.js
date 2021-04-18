import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProject } from '../gitlab/index.js';
import '../gitlab/avatar.js';
import '../pdf-password.js';
import '../ui/icon.js';
import './project/projectActivity.js';
import './project/projectRecentIssues.js';

const gitlabCiJobName = "build";
const gitlabProjectPathPattern = /^(?<namespace>[a-zA-Z]+)\/(?<prefix>pen|off)-(?<name>[a-zA-Z0-9](?:-?[a-zA-Z0-9]+)*)$/;

export class Project extends GitlabProject {

	get title() {
		// if (this.gitlabProjectData.name.startsWith("pen-")) {
		// 	return this.gitlabProjectData.name.substr(4);
		// }
		return this.gitlabProjectData.path.substr(4);
	}

	get allFindings(){
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "finding" || label.toLowerCase() === "non-finding"));
	}

	get recentFindings(){
		return this.allFindings.slice(0, 5);
	}

	get findings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "finding"));
	}

	get nonFindings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "non-finding"));
	}

	get members() {
		return this.gitlabProjectMembers
			.filter((member) => member.username !== `project_${this.gitlabProjectId}_bot`);
	}

	get staff() {
		return this.members
			.filter((member) => member.access_level >= 40);
	}

	get customers() {
		return this.members
			.filter((member) => member.access_level < 40);
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

	static get severityLabelPrefix() {
		return "ThreatLevel:";
	}

	get severityLabels() {
		const prefix = this.constructor.severityLabelPrefix;
		const severities = this.constructor.severities;
		return this.gitlabProjectLabels
			.filter((label) => {
				return severities
					.map((severity) => `${prefix}:${severity}`.toLowerCase())
					.includes(label.name.toLowerCase());
			})
			.map((label) => {
				return {
					...label,
					severity: label.name.substr(prefix.length)
				};
			})
			.sort((a, b) => severities.indexOf(a.name) - severities.indexOf(b.name))
			.reduce((curr, next) => {
				curr[next.name] = next;
				return curr;
			}, {});
	}

	get findingsBySeverity() {
		const output = {};
		this.findings.forEach((finding) => {
			let severity = "ToDo";
			for (let label of finding.labels) {
				if (label.toLowerCase().startsWith(this.constructor.severityLabelPrefix.toLowerCase())) {
					severity = label.substr(this.constructor.severityLabelPrefix.length);
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

	severityColorStyle(severity) {
		const severityLabels = this.severityLabels;
		if (!severityLabels.hasOwnProperty(severity)) {
			return 'color: #212529 !important; background-color: #ffc107 !important;';
		} else {
			const label = severityLabels[severity];
			return `color: ${label.text_color} !important; background-color: ${label.color}`;
		}
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

	get channelName() {
		const namespace = this.gitlabProjectData.namespace.path;
		const projectPath = this.gitlabProjectData.path_with_namespace;
		const match = projectPath.match(gitlabProjectPathPattern);

		if (match === null) {
			return;
		}

		if (namespace === "ros") {
			return `${match.groups.prefix}-${match.groups.name}`;
		} else {
			return `${namespace}-${match.groups.prefix}-${match.groups.name}`;
		}
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

	static getAvatarUrl(project) {
		return project.avatar_url || project.namespace.avatar_url;
	}

	static get styles() {
		return css`
		.avatar {
			width: 100px;
			height: 100px;
		}
		`;
	}

	render() {
		if (this.gitlabProjectData === null) {
			return html`loading ${this.gitlabProjectId}...`;
		}

		const findings = this.findings;
		const nonFindings = this.nonFindings;

		const channelName = this.channelName;

		return html`
		<link rel="stylesheet" href="style.css"/>
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="row">
			<div class="col-12 bg-light">
				<header class="my-3 p-3 bg-body rounded shadow-sm bg-body">
					<div class="d-flex flex-row flex-wrap flex-md-nowrap align-items-end pb-2 mb-3 border-bottom">
						<div class="flex-grow-1">
							<div class="w-100 pt-1">
								<nav aria-label="breadcrumb" class="d-flex">
									<ol class="breadcrumb">
										<li class="breadcrumb-item">Projects</li>
										<li class="breadcrumb-item">${this.gitlabProjectData.namespace.name}</li>
										<li class="breadcrumb-item active" aria-current="page">${this.gitlabProjectData.name}</li>
									</ol>
								</nav>
							</div>
							<h1>${this.gitlabProjectData.name}</h1>
						</div>
						<img class="avatar me-3" src="${this.constructor.getAvatarUrl(this.gitlabProjectData)}" />
					</div>
					<div class="d-flex flex-row justify-content-between align-items-end mb-3">
						<div class="d-flex me-auto">
							<ul class="list-group list-group-horizontal">
								<li class="list-group-item active" aria-current="true">${findings.length} finding${(findings.length === 1) ? "" : "s"}</li>
								<li class="list-group-item bg-secondary text-white">${nonFindings.length} non-finding${(nonFindings.length === 1) ? "" : "s"}</li>
							</ul>
						</div>
						<div class="d-flex">
							${channelName !== undefined ? html`
								<a aria-current="page" href="https://chat.radicallyopensecurity.com/group/${channelName}" target="_blank" role="button" class="btn btn-secondary me-2">
									<ui-icon icon="message-square"></ui-icon>
									Chat
								</a>
							` : ''}
							${this.gitlabProjectData.web_url !== undefined ? html`
								<a aria-current="page" href="${this.gitlabProjectData.web_url}" target="_blank" role="button" class="btn btn-secondary me-2">
									<ui-icon icon="gitlab"></ui-icon>
									Git
								</a>
							` : ''}
						</div>
						<div class="d-flex btn-toolbar">
							<div class="input-group flex-nowrap">
								${!!this.pdfPassword ? html`<span class="input-group-text">
									<pdf-password cleartext="${this.pdfPassword}"></pdf-password>
								</span>` : ``}
								<a class="btn btn-outline-secondary bg-primary text-white" title="${this._assetFileName}" href="${this._artifactDownloadUrl}">
									Report
									<ui-icon icon="file-text"></ui-icon>
								</a>
							</div>
						</div>
					</div>
					<div class="d-flex flex-row w-100 align-self-stretch">
						<div class="me-auto border rounded p-2">
							<h5>Staff</h5>
							<div class="d-flex flex-wrap">
								${this.staff.map((member) => html`
									<div class="p-2 flex-fill flex-nowrap text-nowrap text-center">
										<a href="/${member.username}" target="_blank">
											<gitlab-avatar .user="${member}"></gitlab-avatar>
											<br/>
											${member.name}
										</a>
									</div>
								`)}
							</div>
						</div>
						<div class="border rounded p-2 ms-2">
							<h5>Customer${this.customers.length > 1 ? "s" : ""}</h5>
							<div class="d-flex flex-wrap">
								${this.customers.map((member) => html`
									<div class="p-2 flex-fill flex-nowrap text-nowrap text-center">
										<a href="/${member.username}" target="_blank">
											<gitlab-avatar .user="${member}"></gitlab-avatar>
											<br/>
											${member.name}
										</a>
									</div>
								`)}
							</div>
						</div>
					</div>
				</header>
				<div class="row">
					<div class="col-12 col-lg-6">
						<div class="my-3 p-3 bg-body rounded shadow-sm">
							<h3>Findings <span class="badge bg-primary">${findings.length}</span></h3>
							${Object.entries(this.findingsBySeverity).map(([severity, findings]) => html`
								
								<h5>${severity} <span class="badge" style="${this.severityColorStyle(severity)}">${findings.length}</span></h5>
								<div class="list-group mb-3">
									${findings.map((finding) => {
										return html`
								<div class="list-group-item list-group-item-action">
									<div class="d-flex w-100 justify-content-between">
										<a href="${this.gitlabProjectData.web_url}/issues/${finding.iid}" target="_blank"><h6 class="mb-1">${finding.title} - #${finding.iid}</h6></a>
										<small>Updated ${moment(finding.updated_at).fromNow()}</small>
									</div>
									<p class="mb-1">${finding.description} </p>
									<small>Created at: ${moment(finding.created_at).calendar()}</small>
								</div>
							`;
									})}
								</div>
							`)}
							
							<h3>Non-Findings <span class="badge bg-secondary">${nonFindings.length}</span></h3>
							<div class="list-group">
								${this.nonFindings.map((nonFinding) => html`
								<div class="list-group-item list-group-item-action">
									<div class="d-flex w-100 justify-content-between">
										<a href="${this.gitlabProjectData.web_url}/issues/${nonFinding.iid}" target="_blank"><h6 class="mb-1">${nonFinding.title} - #${nonFinding.iid}</h6></a>
										<small>Updated ${moment(nonFinding.updated_at).fromNow()}</small>
									</div>
									<p class="mb-1">${nonFinding.description}</p>
									<small>Created at: ${moment(nonFinding.created_at).calendar()}</small>
								</div>`)}
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-6">
						<div class="row">
							<div class="col-12">
								<div class="my-3 p-3 bg-body rounded shadow-sm">
									<h3>Recently changed Findings</h3>
									<div class="list-group mb-3">
										${this.recentFindings.map((finding) => html`
											<ros-project-recent-issues .finding="${finding}" .project="${this.gitlabProjectData}"></ros-project-recent-issues>
										`)}
									</div>
								</div>
							</div>
							<div class="col-12">
								<div class="my-3 p-3 bg-body rounded shadow-sm">
									<h3>History</h3>
									${Object.entries(this.eventsByDay).map(([day, events]) => { return html`
										<h4>${moment(day).format("dddd, DD.MM.YYYY")}</h4>
										<div class="mb-3">
											${events.map((eventData) => html`
											<ros-project-activity .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-activity>
											`)}
										</div>
									`;})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);