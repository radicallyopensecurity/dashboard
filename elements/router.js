import { LitElement, html, css } from '../web_modules/lit-element.js';
import "./ros/project.js";
import "./ros/projects.js";
import "./views/allProjectsView.js";

class Router extends LitElement {

	constructor() {
		super();
		this.projectId = null;
		this.route = "";
		this.onHashChange();
	}

	static get properties() {
		return {
			gitlabProjectId: {
				type: Number,
				notify: true,
				reflect: true
			},
			route: {
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
			this.gitlabProjectId = parseInt(hashFragments[0], 10) || null;
			this.route = hashFragments[1];
		}
	}

	render() {

		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>
		<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap shadow">
		<span>Radically Open Security</span>
		</header>

		<div class="container-fluid">
			<div class="row">
				<nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
					<div class="position-sticky pt-3">
						<ul class="nav flex-column">
							<li class="nav-item">
								<a class="nav-link" href="https://chat.radicallyopensecurity.com" target="_blank">Rocket.Chat</a>
							</li>
						</ul>
					</div>
				</nav>

				<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
					<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
						<h1 class="h2">Dashboard</h1>
						<div class="btn-toolbar mb-2 mb-md-0">
							<div class="btn-group me-2">
								<button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
								<button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
							</div>
							<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
								<span data-feather="calendar"></span>
								This week
							</button>
						</div>
					</div>

					${this.gitlabProjectId !== null ? html`
						<ros-project .gitlabProjectId="${this.gitlabProjectId}"></ros-project>
					` : html`
						<ros-all-projects-view></ros-all-projects-view>
					`}
				</main>
			</div>
		</div>
		`;

		if (this.gitlabProjectId !== null) {
			return html``;
		} else {
			return html``;
		}
	}

}
customElements.define("app-router", Router);
