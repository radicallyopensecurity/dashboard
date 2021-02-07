import { LitElement, html, css } from '../web_modules/lit-element.js';
import "./ros/project.js";
import "./ros/project-new.js";
import "./ros/projects.js";
import "./views/allProjectsView.js";
import "./gitlab/user.js";

class Router extends LitElement {

	constructor() {
		super();
		this.projectId = null;
		this.search= "",
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
		}
	}

	clearSearchInput() {
		this.search = "";
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectId") && this.gitlabProjectId !== null) {
			this.clearSearchInput();
		}
	}

	render() {

		let view;
		if (this.gitlabProjectId === "new") {
			view = html`<ros-project-new></ros-project-new>`;
		} else if (this.gitlabProjectId !== null) {
			view = html`<ros-project .gitlabProjectId="${parseInt(this.gitlabProjectId, 10)}"></ros-project>`;
		} else {
			view = html`<ros-all-projects-view></ros-all-projects-view>`;
		}

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>
		<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
			<a class="navbar-brand col-md-3 col-xl-2 me-0 px-3"
			   href=".">
				Radically Open Security
			</a>
			<button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<input class="form-control form-control-dark w-100" type="text" id="search" name="search" @input=${e => { this.search = e.target.value; this.gitlabProjectId = null; location.hash = ''; }} .value="${this.search}" placeholder="Search" aria-label="Search">

			<ul class="navbar-nav px-3">
				<li class="nav-item text-nowrap">
					<div class="nav-link" href="#"><gitlab-user></gitlab-user></div>
				</li>
			</ul>
		</header>
		${view}`;


	}

}
customElements.define("app-router", Router);
