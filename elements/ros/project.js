import moment from '../../web_modules/moment.js';
import marked from '../../lib/marked.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';
import { repeat } from '../../web_modules/lit-html/directives/repeat.js';
import { LitNotify } from '../../lib/lit-element-notify.js';
import { GitlabProject } from '../gitlab/project.js';
import { Finding } from '../ros/finding.js';
import { getChannelUrl } from '../rocketchat/iframe.js';
import { gitlabAuth } from '../gitlab/index.js';
import '../gitlab/avatar.js';
import '../pdf-password.js';
import { ContentCard } from '../ui/content-card.js';
import '../ui/accordion.js';
import '../ros/finding.js';
import '../ros/non-finding.js';
import '../ros/ui/unsafe-finding-content.js';
import '../ui/icon.js';
import './project/projectActivity.js';
import './project/projectRecentIssues.js';

const gitlabCiJobName = "build";
const gitlabProjectPathPattern = /^(?<namespace>[a-zA-Z]+)\/(?:(?<prefix>pen|off)-)?(?<name>[a-zA-Z0-9](?:-?[a-zA-Z0-9]+)*)$/;

class ChatContentCard extends ContentCard {

	get _cardClasses() {
		const classes = super._cardClasses;
		delete classes.rounded;
		classes["rounded-bottom"] = true;
		return classes;
	}

	static get styles() {
		return css`
		${super.styles}

		#card {
			height: auto;
		}

		@media (min-width: 576px) {
			#card {
				height: 300px;
			}
		}
		`;
	}
}
customElements.define("project-ui-content-card-chat", ChatContentCard);

export class Project extends LitNotify(GitlabProject) {

	constructor() {
		super();
		this.fullscreen = true;
		this.offerte = null;
	}

	static get properties() {
		return {
			...GitlabProject.properties,
			subroute: {
				type: String,
				reflect: true
			},
			availableSubroutes: {
				type: Object,
				notify: true
			},
			fullscreen: {
				type: Boolean,
				notify: true,
				reflect: true
			},
			pageTitle: {
				type: String,
				notify: true
			},

			offerte: {
				type: Object,
				notify: true
			},

			archived: {
				type: Boolean,
				notify: true
			},

			_selectedChatTabState: {
				type: Boolean
			}
		}
	}

	willUpdate(changedProperties) {
		this.availableSubroutes = this.constructor.subroutes;
		if (changedProperties.has("gitlabProjectId")) {
			this.queryOfferte();
		}
		super.willUpdate(changedProperties);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectData")) {
			if (this.gitlabProjectData instanceof Object) {
				this.archived = this.isArchived

				if (this.gitlabProjectData.namespace.path === "ros") {
					this.pageTitle = this.gitlabProjectData.name;
				} else {
					this.pageTitle = this.gitlabProjectData.name_with_namespace;
				}
			} else {
				this.pageTitle = undefined;
			}
		}
	}

	static get subroutes() {
		return {
			overview: {
				title: "Overview",
				icon: "pie-chart"
			},
			findings: {
				title: "Findings",
				icon: "gitlab"
			},
			chat: {
				title: "Chat",
				icon: "message-square"
			}
		};
	}

	get activeSubroute() {
		if (this.subroute == undefined) {
			return Object.entries(this.constructor.subroutes)
				.filter(([name, options]) => options.default === true)
				.map(([name, options]) => name)
				.pop();
		} else {
			return this.subroute;
		}
	}

	async queryOfferte() {
		this.offerte = null;
		this.offerte = await fetch(`/api/v4/projects/${this.gitlabProjectId}/repository/files/source%2Fofferte.xml?ref=main`)
			.then(response => response.json())
			.then(filedata => atob(filedata.content))
			.then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
			.then(xmldata => {
				const planning = xmldata.getElementsByTagName("planning")[0];
				const start = planning.getElementsByTagName("start")[0].textContent;
				const end = planning.getElementsByTagName("end")[0].textContent;
				return {
					start: moment(start, "YYYY-MM-DD"),
					end: moment(end, "YYYY-MM-DD")
				};
			});
	}

	get title() {
		if (this.gitlabProjectData.name.startsWith("pen-") || this.gitlabProjectData.name.startsWith("off-")) {
			return this.gitlabProjectData.name.substr(4);
		}
		return this.gitlabProjectData.path;
	}

	get allFindings() {
		return this.gitlabProjectIssues.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "finding" || label.toLowerCase() === "non-finding"));
	}

	get recentFindings() {
		return this.allFindings.slice(0, 5);
	}

	get findings() {
		return this.gitlabProjectIssues
			.filter((gitlabIssue) => gitlabIssue.state !== "closed")
			.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "finding"));
	}

	get nonFindings() {
		return this.gitlabProjectIssues
			.filter((gitlabIssue) => gitlabIssue.state !== "closed")
			.filter((gitlabIssue) => gitlabIssue.labels.some((label) => label.toLowerCase() === "non-finding"))
		// .map((gitlabIssue) => html`
		// 	<ros-non-finding
		// 		.gitlabProjectId="${this.gitlabProjectId}"
		// 		.gitlabIssueId="${this.gitlabIssueIid}"
		// 	></ros-non-finding>
		// `);
	}

	get members() {
		return this.gitlabProjectMembers
			.filter((member) => member.username !== `project_${this.gitlabProjectId}_bot`)
			.filter((member) => ["rosbot", "golem"].indexOf(member.username.toLowerCase()) === -1);
	}

	get staff() {
		return this.members
			.filter((member) => member.access_level >= 40);
	}

	get customers() {
		return this.members
			.filter((member) => member.access_level < 40);
	}

	get states() {

		const states = {
			offerte: {
				enabled: true,
				prefix: "off",
				documentName: "Offerte"
			},
			pentest: {
				enabled: false,
				prefix: "pen",
				documentName: "Report"
			}
		};

		this.gitlabProjectData.tag_list
			.forEach((tag) => {
				if (states[tag]) {
					states[tag].enabled = true;
				}
			});

		return states;

	}

	get enabledStates() {
		const enabledStates = {};
		Object.entries(this.states)
			.filter(([name, options]) => !!options.enabled)
			.forEach(([name, options]) => enabledStates[name] = options);
		return enabledStates;
	}

	get selectedChatTabState() {
		const states = this.enabledStates;
		if (states.length === 0) {
			return "offerte";
		}
		return this._selectedChatTabState || Object.keys(states).pop();
	}

	set selectedChatTabState(value) {
		if (!Object.keys(this.states).includes(value)) {
			throw new Error("Invalid chat tab state");
		}
		this._selectedChatTabState = value;
	}

	get onClickChatTab() {
		return (e) => {
			if (e.shiftKey || e.altKey) {
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			const target = e.target;
			this._selectedChatTabState = target.getAttribute("name");
		}
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
					.map((severity) => `${prefix}${severity}`.toLowerCase())
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
				curr[next.severity] = next;
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

	getChannelName(prefix) {
		const namespace = this.gitlabProjectData.namespace.path;
		const projectPath = this.gitlabProjectData.path_with_namespace;
		const match = projectPath.match(gitlabProjectPathPattern);

		if (match === null) {
			return;
		}

		prefix = prefix || match.groups.prefix || this.states[this.selectedChatTabState].prefix;

		if (namespace === "ros") {
			return `${prefix}-${match.groups.name}`;
		} else {
			return `${namespace}-${prefix}-${match.groups.name}`;
		}
	}

	get channelName() {
		return this.getChannelName();
	}

	getArtifactDownloadUrl(documentType) {
		return `/api/v4/projects/${this.gitlabProjectId}/jobs/artifacts/${this.branchName}/raw/target/${this.getAssetFileName(documentType)}?job=${gitlabCiJobName}`;
	}

	getAssetFileName(documentType) {
		const availableDocumentTypes = Object.values(this.states)
			.map((state) => state.documentName.toLowerCase());

		if (availableDocumentTypes.includes(documentType)) {
			return `${documentType}_${this.title}.pdf`;
		}

		throw new Error("Unsupported document type");
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
			width: 138px;
			height: 138px;
		}

		@media (max-width: 767px) {
			.avatar {
				width: 192px;
				height: 192px;
			}
		}

		.list-group-item {
			cursor: pointer;
			transition: background-color 0.2 ease;
		}

		.nav-tabs {
			border-bottom: none;
		}

		.nav-tabs .nav-item {
			border: none !important;
		}

		.nav-tabs .nav-link.active {
			font-weight: bold;
		}

		#chat-card {
			position: relative;
		}

		:host-context(:host:not([subroute])) [subroute="overview"] {
			display: block !important;
		}
		:host(:not([subroute])) [subroute="overview"] {
			display: block !important;
		}

		:host([subroute="overview"]) [subroute="overview"],
		:host([subroute="chat"]) [subroute="chat"],
		:host([subroute="findings"]) [subroute="findings"] {
			display: block !important;
		}

		.flex-item {
			flex-grow: 1;
			flex-shrink: 1;
			flex-base: 0;
		}

		a.member-link {
			text-decoration: none;
		}

		a.member-link span {
			text-decoration: underline;
		}
		`;
	}

	get isArchived() {
		return this.gitlabProjectData.topics.includes('archive')
	}

	async onClickArchive() {
		const token = gitlabAuth.token;

		let topics = this.gitlabProjectData.topics
		if (topics.includes('archive')) {
			topics = topics.filter(x => x !== 'archive')
		} else {
			topics = topics.concat(['archive'])
		}

		const res = await fetch(`/api/v4/projects/${this.gitlabProjectId}`, {
			method: 'PUT',
			headers: {
				'PRIVATE-TOKEN': token,
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				topics
			})
		})

		if (!res.ok) {
			alert(`Failed: ${await res.text()}`)
			return
		}

		this.gitlabProjectData = {
			...this.gitlabProjectData,
			topics
		}
	}

	render() {
		if (this.gitlabProjectData === null) {
			return html`
				<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
				<div class="d-flex justify-content-center">
					<div class="spinner-border mb-3 mt-3" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
				<h1 class="text-center">loading ${this.gitlabProjectId}...<h1>
			`;
		}

		const findings = this.findings;
		const nonFindings = this.nonFindings;

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="row d-none d-sm-block" subroute="overview">
			<div class="col-12 px-0 px-sm-3">
				<header><ui-content-card>
					<div class="d-block d-md-flex flex-row flex-wrap flex-md-nowrap align-items-start pb-2 align-items-center">
						<div class="flex-grow-1">
							<div>
								<div id="namespace" class="lead d-block d-md-inline text-center">${this.gitlabProjectData.namespace.name}</div>
							</div>
							<div>
								<h1 class="d-block d-md-inline text-center">${this.gitlabProjectData.name}</h1>
							</div>
							<div class="d-flex me-auto d-none">
								<ul class="list-group list-group-horizontal">
									<li class="list-group-item">${findings.length} finding${(findings.length === 1) ? "" : "s"}</li>
									<li class="list-group-item">${nonFindings.length} non-finding${(nonFindings.length === 1) ? "" : "s"}</li>
								</ul>
							</div>
							<div class="d-flex d-md-inline-flex flex-column flex-sm-row align-items-center mt-3 justify-content-center">
								<div class="d-flex text-nowrap mb-2 mb-sm-4">
									${this.gitlabProjectData.web_url !== undefined ? html`
										<a aria-current="page" href="${this.gitlabProjectData.web_url}" target="_blank" role="button" class="btn btn-secondary me-2">
											<ui-icon icon="gitlab"></ui-icon>
											Git
										</a>
									` : ''}
								</div>
								${Object.keys(this.enabledStates).includes("offerte") ? html`
									<div class="d-flex text-nowrap mb-2 mb-sm-4">
										${this.gitlabProjectData.web_url !== undefined ? html`
											<a class="btn btn-outline-secondary bg-primary text-white me-2" title="${this._assetFileName}" href="${this.getArtifactDownloadUrl("offerte")}">
												<ui-icon icon="file-text"></ui-icon>
												Offerte
											</a>
										` : ''}
									</div>
								` : ''}
								${Object.keys(this.enabledStates).includes("pentest") ? html`
									<div class="d-flex btn-toolbar text-nowrap mb-4">
										<div class="input-group flex-nowrap">
											${!!this.pdfPassword ? html`<span class="input-group-text">
												<pdf-password cleartext="${this.pdfPassword}"></pdf-password>
											</span>` : ``}
											<a class="btn btn-outline-secondary bg-primary text-white" title="${this._assetFileName}" href="${this.getArtifactDownloadUrl("report")}">
												Report
												<ui-icon icon="file-text"></ui-icon>
											</a>
										</div>
									</div>
								` : ''}
								${html`
										<div class="d-flex btn-toolbar text-nowrap mb-4">
											<div class="input-group flex-nowrap">
												<button 
													@click="${this.onClickArchive}"
													class="btn btn-outline ${this.archived ? 'bg-warning' : 'bg-danger'}"
													type="button"
													aria-expanded="false"
													aria-label="Archive/Unarchive"
												>
													${this.archived
														? html`<ui-icon icon="corner-down-left"></ui-icon> Unarchive`
														: html`<ui-icon icon="archive"></ui-icon> Archive`}
												</button>
											</div>
								</div>`}
							</div>
							${this.offerte !== null ? html`
								<div id="offerte">
									<div>Start: ${this.offerte.start.format("DD.MM.YYYY")}</div>
									<div>End: ${this.offerte.end.format("DD.MM.YYYY")}</div>
								</div>
							` : undefined}
						</div>
						<div class="ms-0 ms-md-3 d-block text-center">
							<img class="avatar" src="${this.constructor.getAvatarUrl(this.gitlabProjectData)}" />
						</div>
					</div>
				</div>
			</ui-content-card></header>
		</div>
		<div class="row d-none d-sm-block" subroute="chat">
			<div class="col-12 px-0 px-sm-3">
				<ul class="nav nav-tabs">
					${Object.entries(this.enabledStates)
				.map(([name, options]) => {
					const classes = {
						"nav-link": true
					};
					if (name === this.selectedChatTabState) {
						classes["active"] = true;
						classes["bg-white"] = true;
					}
					return html`
								<li class="nav-item shadow-sm" @click="${this.onClickChatTab}">
									<a class="${classMap(classes)}"
										style="text-transform: capitalize; border: none;"
										name="${name}"
										aria-current="page"
										href="${getChannelUrl(this.getChannelName(this.states[name].prefix))}"
									>${name}</a>
								</li>
							`;
				})
			}
				</ul>
				<div class="chat-frame">
					<project-ui-content-card-chat resize="vertical" id="chat-card" seamless="true">
						<ros-rocketchat-frame channel="${this.channelName}"></ros-rocketchat-frame>
					</project-ui-content-card-chat>
				</div>
			</div>
		</div>
		<div class="row d-none d-sm-block" subroute="overview">
			<div class="col-12 px-0 px-sm-3">
				<div class="row">
					<div class="col-12 col-xl-7 col-xxl-8 d-none d-sm-block px-0 px-sm-3 pe-lg-2">
						<ui-content-card>
							<h3>Recent Changes</h3>
							<div class="list-group mb-3">
								${this.recentFindings.map((finding) => html`
									<ros-project-recent-issues .finding="${finding}" .project="${this.gitlabProjectData}"></ros-project-recent-issues>
								`)}
							</div>
						</ui-content-card>
					</div>
					<div class="col-12 col-xl-5 col-xxl-4 d-none d-sm-block px-0 px-sm-3 ps-lg-2">
						<ui-content-card seamless="true">
							<div class="d-flex flex-row w-100 align-self-stretch flex-wrap p-2">
								<div class="rounded p-2 m-1 flex-grow-1">
									<h5>Crew</h5>
									<div class="d-flex flex-wrap">
										${this.staff.map((member) => html`
											<div class="p-2 flex-item flex-nowrap text-nowrap">
												<a href="/${member.username}" target="_blank" class="member-link">
													<gitlab-avatar .user="${member}" class="me-1" style="--line-height: 24px;"></gitlab-avatar>
													<span>${member.name}</div>
												</a>
											</div>
										`)}
									</div>
								</div>
								<div class="rounded p-2 m-1 flex-grow-1">
									<h5>Stakeholder${this.customers.length > 1 ? "s" : ""}</h5>
									<div class="d-flex flex-wrap">
										${this.customers.map((member) => html`
											<div class="p-2 flex-item flex-nowrap text-nowrap">
												<a href="/${member.username}" target="_blank" class="member-link">
													<gitlab-avatar .user="${member}" class="me-1" style="--line-height: 24px;"></gitlab-avatar>
													<span>${member.name}</span>
												</a>
											</div>
										`)}
									</div>
								</div>
							</div>
						</ui-content-card>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-12 col-xl-7 col-xxl-8 d-none d-sm-block px-0 px-sm-3 pe-lg-2" subroute="findings">
				<ui-content-card>
					<h3 class="pb-1">Findings <span class="badge bg-primary">${findings.length}</span></h3>
					${repeat(Object.entries(this.findingsBySeverity), ([severity, findings]) => severity, ([severity, findings]) => html`
						<h5 class="py-1">${severity} <span class="badge" style="${this.severityColorStyle(severity)}">${findings.length}</span></h5>
						<ui-accordion .items="${findings.map((finding) => {
				const title = html`
								<span style="min-width: 2ch;" class="small me-1 text-muted">${finding.iid}</span>
								<span>${finding.title}</span>
							`;
				const $rosFinding = document.createElement('ros-finding');
				$rosFinding.autoload = false;
				$rosFinding.gitlabProjectId = this.gitlabProjectId;
				$rosFinding.gitlabProjectFullPath = this.gitlabProjectData.web_url;
				$rosFinding.gitlabIssueData = finding;
				$rosFinding.gitlabIssueIid = finding.iid;
				$rosFinding.onBecomeVisible = async function () {
					await $rosFinding.fetch();
					$rosFinding.requestUpdate("gitlabIssueData");
				};
				return { title, content: $rosFinding, id: `${this.gitlabProjectId}::${finding.iid}` };
			})}"></ui-accordion>
					`)}
					<h3 class="pb-1">Non-Findings <span class="badge bg-secondary">${nonFindings.length}</span></h3>
					<div class="list-group">
						<ui-accordion .items="${nonFindings.map((nonFinding) => {
				const title = html`
								<span class="small me-2 text-muted">${nonFinding.iid}</span>
								<span>${nonFinding.title}</span>
							`;
				const $rosNonFinding = document.createElement('ros-non-finding');
				$rosNonFinding.autoload = false;
				$rosNonFinding.gitlabProjectId = this.gitlabProjectId;
				$rosNonFinding.gitlabProjectFullPath = this.gitlabProjectData.web_url;
				$rosNonFinding.gitlabIssueData = nonFinding;
				$rosNonFinding.gitlabIssueIid = nonFinding.iid;
				return { title, content: $rosNonFinding, id: `${this.gitlabProjectId}::${nonFinding.iid}` };
			})}"></ui-accordion>
					</div>
				</ui-content-card>
			</div>
			<div class="col-12 col-xl-5 col-xxl-4 d-none d-sm-block px-0 px-sm-3 ps-lg-2" subroute="overview">
				<ui-content-card>
					<h3>History</h3>
					<ui-accordion .items="${Object.entries(this.eventsByDay).map(([day, events]) => {
				const dateString = moment(day).format("dddd, DD.MM.YYYY");
				const title = html`
							<span>${dateString}</span>
						`;

				const content = events.map((eventData) => html`
							<ros-project-activity .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-activity>
						`);
				return { title, content, id: dateString };
			})}"></ui-accordion>
				</ui-content-card>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);