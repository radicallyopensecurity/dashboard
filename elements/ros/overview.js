import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';
import { RosProjects } from '../ros/projects.js';
import '../rocketchat/iframe.js';
import '../ui/icon.js';
import '../ui/breadcrumbs.js';
import '../ui/content-card.js';

class Overview extends LitElement {

	constructor() {
		super();
		this.projects = [];
	}

	static getAvatarUrl(project) {
		return project.avatar_url || project.namespace.avatar_url;
	}

	static get properties() {
		return {
			projects: {
				type: Array
			},
			gitlabUser: {
				type: Object
			}
		};
	}

	static get styles() {
		return css`
		.small {
			font-size: 0.75em;
		}

		.avatar {
			width: 48px;
			height: 48px;
		}

		#hiddenIframe {
			position: absolute;
			width: 0;
			height: 0;
			overflow: hidden;
			opacity: 0;
		}
		`;
	}

	renderSection(name, projects) {
		return html`
			<div class="row">
				<div class="col-12"><h2>${name}</h2></div>
			</div>
			<div class="row">
				<div class="col-12">
					<div class="list-group">
						${projects.map((project) => html`
							<a href="#${project.id}" class="list-group-item list-group-item-action d-flex align-items-center" aria-current="true" >
								<img class="avatar me-3" src="${this.constructor.getAvatarUrl(project)}" />
								<div class="w-100">
									<div class="d-flex w-100 justify-content-between">
										<div>
											<h5 class="mb-2">${project.name_with_namespace}</h5>
										</div>
										<small>
											${project.hasUnreadMessages ? html`<ui-icon icon="mail"></ui-icon>` : ''}
										</small>
									</div>
									<p class="mb-1">
										Updated ${project.lastProjectActivity.fromNow()}
									</p>
								</div>
							</a>
						`)}
					</div>
				</div>
			</div>
		`;
	}

	render() {

		const loadingIndicatorClass = classMap({
			"spinner-border": true,
			"me-2": true,
			"d-none": !this.loading
		});

		const pentests = this.projects.filter((project) => project.isPentest);
		const offertes = this.projects.filter((project) => project.isOfferte);

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>

		<div class="row">
			<div class="col-12 bg-light">
				<ui-content-card>
					<div class="d-flex align-items-center">
						<h1 class="me-auto">ROS Dashboard</h1>
						<div class="${loadingIndicatorClass}" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
					<div class="row">
						<div class="col-12">
							<p>
								Hi ${this.gitlabUser.name},
							</p>
							<p>
								You have access to ${pentests.length} pentest projects.
							</p>
						</div>
					</div>
				</ui-content-card>
				${this.projects.length > 0 ? html`
					<div class="row gx-3">
						<ui-content-card class="col-12">
							${this.renderSection("Recently Updated", this.projects.slice(0, 5))}
						</ui-content-card>
					</div>
				` : (!this.loading) ? html`
					<p>No projects found</p>
				` : ''}
			</div>
		</div>
		<div id="hiddenIframe">
			<ros-rocketchat-frame channel="ros"></ros-rocketchat-frame>
		</div>
		`;
	}

}
customElements.define("ros-overview", Overview);
