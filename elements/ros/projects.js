import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { GitlabProjects } from '../gitlab/projects.js';

const gitlabProjectPathPattern = /^(?<namespace>[a-zA-Z]+)\/(?:(?<prefix>pen|off)-)?(?<name>[a-zA-Z0-9](?:-?[a-zA-Z0-9]+)*)$/;

const isPentest = (project) => {
	return project.name.startsWith("pen-") || project.tag_list.includes("pentest");
};

const isOfferte = (project) => {
	return project.name.startsWith("off-") || project.tag_list.includes("offerte");
};

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
				.filter((subscription) => project.rocketchatChannelNames.has(subscription.fname));
			if (subscriptions) {
				project.hasUnreadMessages = subscriptions.some((subscription) => subscription.alert);
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
				project.lastChatActivity = null;
			}
		});
		this.projects = [...this.projects.sort(GitlabProjects.sortProjectsByLastActivity)];
		//this.requestUpdate("projects", oldProjectsValue);
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
				if (!isPentest(project) && !isOfferte(project)) {
					return false;
				} else if (project.namespace.path === "pentext") {
					return false;
				}
				return true;
			});
	}

	static mapProjects(projects) {
		return projects
			.map((project) => {
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
