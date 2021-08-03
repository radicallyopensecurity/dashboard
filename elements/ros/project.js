import moment from '../../web_modules/moment.js';
import marked from '../../web_modules/marked.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';
import { LitNotify } from '../../web_modules/@morbidick/lit-element-notify.js';
import { GitlabProject } from '../gitlab/index.js';
import '../gitlab/avatar.js';
import '../pdf-password.js';
import { ContentCard } from '../ui/content-card.js';
import '../ui/accordion.js';
import '../ui/unsafe-content.js';
import '../ui/icon.js';
import './project/projectActivity.js';
import './project/projectRecentIssues.js';

const gitlabCiJobName = "build";
const gitlabProjectPathPattern = /^(?<namespace>[a-zA-Z]+)\/(?:(?<prefix>pen|off)-)?(?<name>[a-zA-Z0-9](?:-?[a-zA-Z0-9]+)*)$/;

// tweak marked renderer
const headingLevelOffset = 2;
marked.use({
	renderer: {
		heading(text, level) {
			level += headingLevelOffset;
			return `<h${level}>${text}</h${level}>`;
		},
		code(code, infostring, escaped) {
			const lang = (infostring || '').match(/\S*/)[0];
			if (this.options.highlight) {
				const out = this.options.highlight(code, lang);
				if (out != null && out !== code) {
					escaped = true;
					code = out;
				}
			}

			code = code.replace(/\n$/, '') + '\n';

			const $pre = document.createElement("pre");
			const $code = document.createElement("code");
			$pre.appendChild($code);
			$pre.classList.add("bg-light", "p-3");

			if (escaped) {
				$code.innerHTML = code;
			} else {
				$code.innerText = code;
			}

			if (lang) {
				$code.classList.add(`${this.options.langPrefix}${escape(lang, true)}`);
			}

			return $pre.outerHTML;
		}
	}
});

class ChatContentCard extends ContentCard {
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
		console.log(this.availableSubroutes);
	}

	connectedCallback() {
		super.connectedCallback();
		this.availableSubroutes = this.constructor.subroutes;
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

			_selectedChatTabState: {
				type: Boolean
			}
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectData")) {
			console.log(this.gitlabProjectData);
			if (this.gitlabProjectData instanceof Object) {
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
				prefix: "off"
			},
			pentest: {
				enabled: false,
				prefix: "pen"
			}
		};

		this.gitlabProjectData.tag_list
			.forEach((tag) => {
				states[tag].enabled = true;
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

	get channelName() {
		const namespace = this.gitlabProjectData.namespace.path;
		const projectPath = this.gitlabProjectData.path_with_namespace;
		const match = projectPath.match(gitlabProjectPathPattern);

		if (match === null) {
			return;
		}

		const prefix = match.groups.prefix || this.states[this.selectedChatTabState].prefix;

		if (namespace === "ros") {
			return `${prefix}-${match.groups.name}`;
		} else {
			return `${namespace}-${prefix}-${match.groups.name}`;
		}
	}

	get chatChannelUrl() {
		const chatHostname = window.location.hostname.replace(/^git\./, "chat.");
		return `https://${chatHostname}/group/${this.channelName}`;
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
		`;
	}

	render() {
		if (this.gitlabProjectData === null) {
			return html`loading ${this.gitlabProjectId}...`;
		}

		const findings = this.findings;
		const nonFindings = this.nonFindings;

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="container-fluid px-sm-0 p-md-2">
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
										${this.channelName !== undefined ? html`
											<a aria-current="page" href="${this.chatChannelUrl}" target="_blank" role="button" class="btn btn-secondary me-2">
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
									<div class="d-flex btn-toolbar text-nowrap mb-4">
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
									<li class="nav-item" @click="${this.onClickChatTab}">
										<a class="${classMap(classes)}"
											style="text-transform: capitalize;"
											name="${name}"
											aria-current="page"
											href="#"
										>${name}</a>
									</li>
								`;
							})
						}
					</ul>
					<div class="chat-frame">
						<project-ui-content-card-chat resize="vertical" id="chat-card" seamless="true">
							<iframe id="chat" class="w-100 h-100"
								src="${this.chatChannelUrl}?layout=embedded"
								sandbox="allow-scripts allow-same-origin allow-forms"
								referrerpolicy="origin"
							></iframe>
						</project-ui-content-card-chat>
					</div>
				</div>
			</div>
			<div class="row d-none d-sm-block" subroute="overview">
				<div class="col-12 px-0 px-sm-3">
					<ui-content-card seamless="true">
						<div class="d-flex flex-row w-100 align-self-stretch flex-wrap p-2">
							<div class="border rounded p-2 m-1 flex-grow-1">
								<h5>Crew</h5>
								<div class="d-flex flex-wrap">
									${this.staff.map((member) => html`
										<div class="p-2 flex-item flex-nowrap text-nowrap text-center">
											<a href="/${member.username}" target="_blank">
												<gitlab-avatar .user="${member}" class="mb-2" style="--line-height: 48px;"></gitlab-avatar>
												<div>${member.name}</div>
											</a>
										</div>
									`)}
								</div>
							</div>
							<div class="border rounded p-2 m-1 flex-grow-1">
								<h5>Stakeholder${this.customers.length > 1 ? "s" : ""}</h5>
								<div class="d-flex flex-wrap">
									${this.customers.map((member) => html`
										<div class="p-2 flex-item flex-nowrap text-nowrap text-center">
											<a href="/${member.username}" target="_blank">
												<gitlab-avatar .user="${member}" class="mb-2" style="--line-height: 48px;"></gitlab-avatar>
												<div>${member.name}</div>
											</a>
										</div>
									`)}
								</div>
							</div>
						</div>
					</ui-content-card>
				</div>
			</div>
			<div class="row">
				<div class="col-12 col-lg-6 d-none d-sm-block px-0 px-sm-3 pe-lg-2" subroute="findings">
					<ui-content-card>
						<h3 class="pb-1">Findings <span class="badge bg-primary">${findings.length}</span></h3>
						${Object.entries(this.findingsBySeverity).map(([severity, findings]) => html`
							<h5 class="py-1">${severity} <span class="badge" style="${this.severityColorStyle(severity)}">${findings.length}</span></h5>
							<ui-accordion .items="${findings.map((finding) => {
								const title = html`
									<span style="min-width: 2ch;" class="small me-1 text-muted">${finding.iid}</span>
									<span>${finding.title}</span>
								`;
								const content = document.createElement("ui-unsafe-content");
								content.unsafeHTML = marked(finding.description, { gfm: true });
								return { title, content };
							})}"></ui-accordion>
						`)}
						<h3 class="pb-1">Non-Findings <span class="badge bg-secondary">${nonFindings.length}</span></h3>
						<div class="list-group">
							<ui-accordion .items="${nonFindings.map((nonFinding) => {
								const title = html`
									<span class="small me-2 text-muted">${nonFinding.iid}</span>
									<span>${nonFinding.title}</span>
								`;
								const content = document.createElement("ui-unsafe-content");
								content.unsafeHTML = marked(nonFinding.description, { gfm: true });
								return { title, content };
							})}"></ui-accordion>
						</div>
					</ui-content-card>
				</div>
				<div class="col-12 col-lg-6 d-none d-sm-block px-0 px-sm-3 ps-lg-2" subroute="overview">
					<div>
						<div class="col-12">
							<ui-content-card>
								<h3>Recent Changes</h3>
								<div class="list-group mb-3">
									${this.recentFindings.map((finding) => html`
										<ros-project-recent-issues .finding="${finding}" .project="${this.gitlabProjectData}"></ros-project-recent-issues>
									`)}
								</div>
							</ui-content-card>
						</div>
						<div class="col-12">
							<ui-content-card>
								<h3>History</h3>
								${Object.entries(this.eventsByDay).map(([day, events]) => { return html`
									<h5 class="mt-3">${moment(day).format("dddd, DD.MM.YYYY")}</h5>
									${events.map((eventData) => html`
									<ros-project-activity .data="${eventData}" .project="${this.gitlabProjectData}"></ros-project-activity>
									`)}
								`;})}
							</ui-content-card>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	}
};

customElements.define("ros-project", Project);