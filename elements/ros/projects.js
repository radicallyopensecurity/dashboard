import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { directive } from "../../web_modules/lit/directive.js";
import { AsyncDirective } from "../../web_modules/lit/async-directive.js";
import { GitlabProjects } from '../gitlab/projects.js';

const gitlabProjectPathPattern = /^(?<namespace>[a-zA-Z]+)\/(?:(?<prefix>pen|off)-)?(?<name>[a-zA-Z0-9](?:-?[a-zA-Z0-9]+)*)$/;

moment.fn.toString = function() { return this.format("YYYY-MM-DD"); }

const isPentest = (project) => {
	return project.name.startsWith("pen-") || project.tag_list.includes("pentest");
};

const isOfferte = (project) => {
	return project.name.startsWith("off-") || project.tag_list.includes("offerte");
};

export const xmlDocumentsCache = {};

class CachedProjectXMLFile {

	constructor(gitlabProjectId, ref, sourceFile) {
		this.gitlabProjectId = gitlabProjectId;
		this.ref = ref || "main";
		this.sourceFile = sourceFile;
		this.directive = directive(CachedXMLDirective);
	}

	queryXMLFile() {
		// fetch new document
		const query = fetch(`/api/v4/projects/${this.gitlabProjectId}/repository/files/${encodeURIComponent(this.sourceFile)}?ref=${this.ref}`);
		return query
			.then((response) => {
				if (response.status !== 200) {
					this.xmlData = null;
					throw new Error(`${this.sourceFile} in project ${this.gitlabProjectId}`);
				}
				return response.json();
			})
			//.then(filedata => atob(filedata.content))
			.then(filedata => new TextDecoder().decode(Uint8Array.from(atob(filedata.content), c => c.charCodeAt(0))))
			.then(text => (new window.DOMParser()).parseFromString(text, "text/xml"));
	}

	get xmlData() {
		const gitlabProjectId = Number(this.gitlabProjectId);
		if (
			!xmlDocumentsCache.hasOwnProperty(gitlabProjectId)
		 || !xmlDocumentsCache[gitlabProjectId].hasOwnProperty([this.ref])
		 || !xmlDocumentsCache[gitlabProjectId][this.ref].hasOwnProperty(this.sourceFile)
		) {
			this.xmlData = this.queryXMLFile();
		}
		return xmlDocumentsCache[gitlabProjectId][this.ref][this.sourceFile];
	}

	set xmlData(value) {
		const gitlabProjectId = Number(this.gitlabProjectId);
		if (!xmlDocumentsCache.hasOwnProperty(gitlabProjectId)) {
			xmlDocumentsCache[gitlabProjectId] = {};
		}
		if (!xmlDocumentsCache[gitlabProjectId].hasOwnProperty([this.ref])) {
			xmlDocumentsCache[gitlabProjectId][this.ref] = {};
		}
		xmlDocumentsCache[gitlabProjectId][this.ref][this.sourceFile] = value;
	}

}

class CachedReportXMLFile extends CachedProjectXMLFile {
	constructor(gitlabProjectId, ref) {
		super(gitlabProjectId, ref, "source/report.xml");
	}

	get latest_version_date() {
		return this.directive((xmlData) => {
			const version_history = xmlData.getElementsByTagName("version_history")[0];
			const versions = version_history.getElementsByTagName("version");
			return versions[0].getAttribute("date");
		}, this.xmlData, "date");
	}

	get version_history() {
		return this.directive((xmlData) => {
			return xmlData.getElementsByTagName("version_history")[0].textContent;
		}, this.xmlData);
	}

}

class CachedOfferteXMLFile extends CachedProjectXMLFile {

	constructor(gitlabProjectId, ref) {
		super(gitlabProjectId, ref, "source/offerte.xml");
	}

	get start() {
		return this.directive(["planning", "start"], this.xmlData, "date");
	}

	get end() {
		return this.directive(["planning", "end"], this.xmlData, "date");
	}

	get report_due() {
		return this.directive(["report_due"], this.xmlData, "date");
	}

}

class CachedXMLDirective extends AsyncDirective {

	render(selector, xmlData, type) {
		// selector can be array of tag names or a map function

		if (xmlData === null) {
			return "N/A";
		}
		xmlData.then((data) => {
			if (data) {
				let value;
				if (typeof selector === "function") {
					value = selector(data);
				} else {
					for (let key of selector) {
						data = data.getElementsByTagName(key)[0];
					}
					value = data.textContent;
				}
				switch (type) {
					case "date":
						switch (value) {
							case "TBD":
								this.setValue(html`<span class="text-muted">TBD</span>`);
								break;
							default:
								this.setValue(moment(value));
								break;
						}
						break;
					default:
						this.setValue(value);
						break;
				}
			}
		});
		return null;
	}

}

class RosProjectData extends LitElement {

	constructor() {
		super();
		this.id = null;
	}

	static get properties() {
		return {
			id: {
				type: Number,
				reflect: true
			}
		}
	}

	get offerte() {
		return new CachedOfferteXMLFile(this.id, this.default_branch, "source/offerte.xml");
	}


	get report() {
		return new CachedReportXMLFile(this.id, this.default_branch, "source/report.xml");
	}

}
customElements.define("ros-project-data", RosProjectData);


export class RosProjects extends GitlabProjects {

	constructor() {
		super();
		this.chatSubscriptions = [];
	}

	static get properties() {
		return {
			...GitlabProjects.properties,
			chatSubscriptions: {
				type: Array
			}
		};
	}

	updateProjects() {
		const oldProjectsValue = this.projects;
		this.projects.forEach((project) => {
			const subscriptions = this.chatSubscriptions
				.filter((subscription) => project.rocketchatChannelNames.has(subscription.name));
			if (subscriptions) {
				project.hasUnreadMessages = subscriptions.some((subscription) => subscription.alert);
				project.mentions = subscriptions.reduce((curr, subscription) => (curr + subscription.userMentions), 0);
				project.lastChatActivity = subscriptions.reduce((curr, next) => {
					const updatedAt = moment(next._updatedAt);
					if (!curr || updatedAt.isAfter(curr)) {
						return updatedAt;
					} else {
						return curr;
					}
				}, null);
				if (project.lastChatActivity && project.lastChatActivity.isAfter(project.lastGitActivity)) {
					project.lastProjectActivity = project.lastChatActivity;
				} else {
					project.lastProjectActivity = project.lastGitActivity
				}
			} else {
				project.hasUnreadMessages = false;
				project.mentions = 0;
				project.lastChatActivity = null;
			}
		});
		this.projects = [...this.projects.sort(GitlabProjects.sortProjectsByLastActivity)];
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has("chatSubscriptions") || changedProperties.has("projects")) {
			this.updateProjects();
		}
	}

	get pentests() {
		return this.projects
			.filter((project) => isPentest(project));
	}

	get offertes() {
		return this.projects
			.filter((project) => isOfferte(project));
	}

	static filterProjects(projects) {
		return projects
			.filter((project) => {
				if (project.archived === true) {
					return false;
				} else if (!isPentest(project) && !isOfferte(project)) {
					return false;
				} else if (project.namespace.path === "pentext") {
					return false;
				}
				return true;
			});
	}

	static mapProjects(projects) {
		return projects
			.map((inputProject) => {

				const project = document.createElement("ros-project-data");
				Object.entries(inputProject).forEach(([key, value]) => project[key] = value);

				project.isPentest = isPentest(project);
				project.isOfferte = isOfferte(project);

				const prefix = project.isPentest ? "pen" : "off";
				const namespace = project.namespace.path;
				const projectPath = project.path_with_namespace;
				const match = projectPath.match(gitlabProjectPathPattern);

				if (match === null) {
					return;
				}

				project.rocketchatChannelNames = new Set();
				if (namespace === "ros") {
					if (project.isPentext) {
						project.rocketchatChannelNames.add(`pen-${match.groups.name}`);
					}
					if (project.isOfferte) {
						project.rocketchatChannelNames.add(`off-${match.groups.name}`);
					}
				} else {
					if (project.isPentext) {
						project.rocketchatChannelNames.add(`${namespace}-pen-${match.groups.name}`);
					}
					if (project.isOfferte) {
						project.rocketchatChannelNames.add(`${namespace}-off-${match.groups.name}`);
					}
				}

				project.lastGitActivity = moment(project.last_activity_at);
				project.lastProjectActivity = project.lastGitActivity;
				return project;
			})
			.filter((project) => (project !== undefined));
	}

	static getAvatarUrl(project) {
		return project.avatar_url || project.namespace.avatar_url;
	}

}
customElements.define("ros-projects", RosProjects);

class RosProjectsList extends RosProjects {
	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>

		<div class="col-12 bg-light">
			<div class="my-3 p-3 bg-body rounded shadow-sm bg-body">

				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap pt-3 pb-2 mb-3 border-bottom">
					<h1>Projects</h1>
					${this.loading ? html`
						<div class="spinner-border mb-2" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					`: ''}
				</div>
				<div class="row">
					<div class="col-12 col-lg-8 col-xl-6">
						 ${this.projects.length > 0 ? html`
							 <div class="list-group">
								${this.projects.map((project) => html`
									<a href="#${project.id}" class="list-group-item list-group-item-action d-flex align-items-center" aria-current="true" >
										<img class="avatar me-3" src="${this.constructor.getAvatarUrl(project)}" />
										<div class="w-100">
											<div class="d-flex w-100 justify-content-between">
												<div>
													<h5 class="mb-2">${project.name_with_namespace}</h5>
												</div>
												<small>
													Updated
													${moment(project.last_activity_at).fromNow()}
												</small>
											</div>
											<p class="mb-1">
												Created at ${moment(project.created_at).format("LL")}
											</p>
										</div>
									</a>
								`)}
							 </div>
						`: (!this.loading) ?
							html`<p>No projects found</p>`: ''}
					</div>
				</div>
			</div>
		</div>`;
	}
};
customElements.define("ros-projects-list", RosProjectsList);
