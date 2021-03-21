import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProject } from '../gitlab/index.js';
import '../gitlab/avatar.js';
import '../pdf-password.js';
import '../ui/icon.js';
import './project/projectActivity.js';
import './project/projectRecentIssues.js';

const gitlabCiJobName = "build";

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

	get membersByRole(){
		const membersByRole = {
			'Staff': [],
			'Client': []
		};
		this.gitlabProjectMembers.forEach((member) => {
			let key = 'Client';
			if (member.access_level > 30) {
				key = 'Staff';
			}
			membersByRole[key].push(member);
		});
		return membersByRole;
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

	severityColorStyle(severity){
		let style = 'color: #212529 !important; background-color: #ffc107 !important;'
		for(let i = 0; i < this.gitlabProjectLabels.length; i++) {
			if (this.gitlabProjectLabels[i].name === 'ThreatLevel:' + severity) {
				style = 'color: ' + this.gitlabProjectLabels[i].text_color + ' !important; background-color: ' + this.gitlabProjectLabels[i].color + ' !important;';
				break;
			}
		}
		return style;
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

		return html`
		<link rel="stylesheet" href="style.css"/>
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="container-fluid">
			<div class="row">
				<nav id="sidebarMenu" class="col-md-3 col-xl-2 bg-body d-md-block sidebar collapse">
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

				<main class="col-md-9 col-xl-10 ms-sm-auto px-md-4 bg-light">
					<header class="my-3 p-3 bg-body rounded shadow-sm bg-body">
						<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
							<div>
								<div class="w-100 pt-1">
									<nav aria-label="breadcrumb mb-1">
										<ol class="breadcrumb">
											<li class="breadcrumb-item"><a href=".">Projects</a></li>
											<li class="breadcrumb-item"><a href="https://git.staging.radical.sexy/groups/ros" target="_blank">${this.gitlabProjectData.namespace.name}</a></li>
											<li class="breadcrumb-item active" aria-current="page">${this.gitlabProjectData.name}</li>
										</ol>
									</nav>
								</div>
								<h1>${this.gitlabProjectData.name}</h1>
							</div>
							
							<img class="avatar me-3" src="${this.constructor.getAvatarUrl(this.gitlabProjectData)}" />
						</div>
						<div class="d-flex flex-column-reverse flex-lg-row justify-content-between mb-3 align-items-start">
							<div class="d-flex">
								${Object.entries(this.membersByRole).map(([role, members]) => html`
								<div class="me-4 border p-2 rounded">
									<h5>${role}</h5>
									<div class="d-flex">
										${members.map((member) => {
										return html`
											<div class="pe-4">
												<a href="/${member.username}" target="_blank"><gitlab-avatar .user="${member}"></gitlab-avatar>${member.name}</a>
											</div>`;
										})}
										${members.length < 1 ? html`
											<div class="pe-4">
												<span>No members</span>
											</div>` : html``}
									</div>
								</div>
							`)}
							</div>
							<div class="btn-toolbar mb-3">
								<div class="input-group">
									<a class="btn btn-outline-secondary bg-primary text-white" title="${this._assetFileName}" href="${this._artifactDownloadUrl}">
										Report
										<ui-icon icon="file-text"></ui-icon>
									</a>
									${!!this.pdfPassword ? html`<span class="input-group-text"><pdf-password cleartext="${this.pdfPassword}"></pdf-password></span>` : ``}
								</div>
							</div>
						</div>
						<div class="d-flex">
							<ul class="list-group list-group-horizontal">
								<li class="list-group-item active" aria-current="true">${findings.length} finding${(findings.length === 1) ? "" : "s"}</li>
								<li class="list-group-item bg-secondary text-white">${nonFindings.length} non-finding${(nonFindings.length === 1) ? "" : "s"}</li>
							</ul>

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
				</main>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);