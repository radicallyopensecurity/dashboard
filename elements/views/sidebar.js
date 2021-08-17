import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { LitNotify } from '../../lib/lit-element-notify.js';
import "../ros/projects.js";

class SidebarView extends LitNotify(LitElement) {

	constructor() {
		super();
		this.projects = [];
		this.search = "";
		this.forceSidebarVisible = false;
		this.selectedProjectId = null;
	}

	static get styles() {
		return css`
		.small {
			font-size: 0.75em;
		}

		main {
			overflow-y: scroll;
			overflow-x: hidden;
		}

		nav {
			overflow-y: scroll;
		}

		#sidebar {
			position: absolute;
			z-index: 999;
			width: 450px;
			min-width: 450px;
			max-width: 450px;
		}

		#sidebar .avatar {
			width: 16px;
			height: 16px;
		}

		#sidebar .nav-item[active=true] .nav-link {
			color: var(--ros-orange);
		}

		#sidebar .nav-item[active=true] .nav-link span {
			text-decoration: underline;
		}

		@media (max-width: 575px) {
			#sidebar {
				width: 100%;
			}
		}

		@media (min-width: 576px) and (max-width: 991px) {
			#sidebar {
				width: auto;
			}
		}

		@media (min-width: 992px) {
			#sidebar{
				position: relative !important;
			}
		}
		`;
	}

	static get properties() {
		return {
			... super.properties,
			search: {
				type: String,
				notify: true
			},
			projects: {
				type: Array,
				notify: false
			},
			selectedProjectId: {
				type: Number,
				reflect: true
			},
			forceSidebarVisible: {
				type: Boolean,
				notify: false,
				reflect: true
			}
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];

		if (keys.includes("forceSidebarVisible")) {
			if (this.forceSidebarVisible === true) {
				this.shadowRoot.getElementById("sidebar").classList.add("show");
			} else {
				this.shadowRoot.getElementById("sidebar").classList.remove("show");
			}
		}
	}

	get onSearch() {
		return (e) => {
			this.search = e.target.search.value;
			e.preventDefault();
			e.stopPropagation();
		};
	}

	static getAvatarUrl(project) {
		return project.avatar_url || project.namespace.avatar_url;
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="position-absolute h-100 w-100 d-block overflow-hidden">
			<div class="position-absolute w-100 h-100 mx-0 d-flex flex-row align-items-stretch">
				<nav id="sidebar" class="d-lg-block bg-body sidebar collapse shadow px-3 h-100 pb-3">
					<div class="position-sticky mx-1 mt-4 mb-1 safe-padding-left">
						<form @submit="${this.onSearch}">
							<div class="input-group">
								<input id="search" name="search" type="search"
									.value="${this.search}"
									class="form-control"
									placeholder="Search"
									aria-label="Search"
									aria-describedby="search-button" />
								<button class="input-group-text btn-primary" id="search-button">
									<ui-icon icon="search"></ui-icon>
								</button>
							</div>
						</form>
						<div class="row">
							<div class="col-12 col-sm-6 col-lg-12">
								<ul class="nav flex-column">
									<li class="nav-item">
										<a class="nav-link text-nowrap" aria-current="page" href="#">
											<ui-icon icon="bookmark"></ui-icon>
											<span>My Projects</span>
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link text-nowrap" aria-current="page" href="#new">
											<ui-icon icon="plus-square"></ui-icon>
											<span>New Project</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div class="row">
							<div class="col-12 col-sm-6 col-lg-12">
								<h6 class="sidebar-heading mt-3 text-muted">
									<span>Projects</span>
								</h6>
								<ul class="nav flex-column">
									${this.projects.map((project) => html`
										<li class="nav-item" active="${project.id === this.selectedProjectId}">
											<a class="nav-link text-nowrap" aria-current="page" href="#${project.id}">
												<img class="avatar feather" src="${this.constructor.getAvatarUrl(project)}" />
												<span>${project.name_with_namespace}</span>
											</a>
										</li>
									`)}
								</ul>
							</div>
							<div class="col-12 col-sm-6 col-lg-12">
								<h6 class="sidebar-heading mt-3 text-muted">
									<span>ROS Services</span>
								</h6>
								<ul class="nav flex-column">
									<li class="nav-item">
										<a class="nav-link text-nowrap" aria-current="page" href="https://chat.radicallyopensecurity.com" target="_blank">
											<ui-icon icon="message-square"></ui-icon>
											Rocket.Chat
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link text-nowrap" aria-current="page" href="https://git.radicallyopensecurity.com" target="_blank">
											<ui-icon icon="gitlab"></ui-icon>
											Gitlab
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link text-nowrap" aria-current="page" href="https://codimd.radicallyopensecurity.com" target="_blank">
											<ui-icon icon="file-text"></ui-icon>
											CodiMD
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</nav>

				<main class="position-relative flex-grow-1 mt-0 p-0 p-sm-3 p-md-1 safe-margin-right safe-margin-left ms-lg-0">
					<slot></slot>
				</main>
			</div>
		</div>
		`;
	}

}
customElements.define("sidebar-view", SidebarView);
