import { LitElement, html, css } from '../web_modules/lit-element.js';
import { LitSync } from '../web_modules/@morbidick/lit-element-notify.js';
import "./ros/project.js";
import "./ros/project-new.js";
import "./ros/projects.js";
import "./ros/overview.js";
import "./views/sidebar.js";
import "./gitlab/user.js";

class Router extends LitSync(LitElement) {

	constructor() {
		super();
		this.projectId = null;
		this.forceSidebarVisible = false;
		this.search = "";
		this.onHashChange();
	}

	static get properties() {
		return {
			gitlabProjectId: {
				type: String,
				notify: true,
				reflect: true
			},
			search: {
				type: String,
				notify: true
			},
			forceSidebarVisible: {
				type: Boolean
			}
		}
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener("hashchange", this.onHashChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener("hashchange", this.onHashChange);	
	}

	get onHashChange() {
		return () => {
			const hash = window.location.hash.substring(1);
			const hashFragments = hash.split("/", 1);

			if (hashFragments[0] === "new") {
				this.gitlabProjectId = "new";
			} else {
				this.gitlabProjectId = parseInt(hashFragments[0], 10) || null;
			}
			this.route = hashFragments[1];
			this.forceSidebarVisible = false;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectId") && this.gitlabProjectId !== null) {
			this.search = "";
		}
	}

	get onClickSidebarToggle() {
		return (e) => {
			this.forceSidebarVisible = !this.forceSidebarVisible;
		}
	}

	render() {

		let view;
		if (this.gitlabProjectId === "new") {
			view = html`<ros-project-new></ros-project-new>`;
		} else if (this.gitlabProjectId !== null) {
			view = html`<ros-project .gitlabProjectId="${parseInt(this.gitlabProjectId, 10)}"></ros-project>`;
		} else {
			view = html`<ros-overview
					.params=${{search: this.search, order_by: "last_activity_at"}}
					perPage="20"
				></ros-overview>`;
		}

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>
		<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap shadow px-3">

			<a class="navbar-brand text-center me-auto" href=".">
				<span class="d-none d-sm-inline">Radically Open Security</span>
				<span class="d-sm-none">ROS</span>
			</a>

			<button @click="${this.onClickSidebarToggle}" class="navbar-toggler collapsed d-md-none" type="button" aria-expanded="false" aria-label="Toggle Sidebar">
				<span class="navbar-toggler-icon"></span>
			</button>

			<ul class="navbar-nav ms-3">
				<li class="nav-item text-nowrap">
					<div class="nav-link" href="#">
						<gitlab-user></gitlab-user>
					</div>
				</li>
			</ul>
		</header>
		<sidebar-view .search="${this.sync('search')}" .forceSidebarVisible="${this.sync('forceSidebarVisible')}">
			${view}
		</sidebar-view>`;

	}

}
customElements.define("app-router", Router);
