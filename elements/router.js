import { LitElement, html, css } from '../web_modules/lit-element.js';
import { LitSync } from '../web_modules/@morbidick/lit-element-notify.js';
import { styleMap } from '../web_modules/lit-html/directives/style-map.js';
import { Gitlab } from "./gitlab/index.js";
import "./ros/project.js";
import "./ros/project-new.js";
import "./ros/projects.js";
import "./ros/overview.js";
import "./views/sidebar.js";

class AuthenticatedRouter extends LitSync(Gitlab) {

	constructor() {
		super();
		this.projectId = null;
		this.forceSidebarVisible = false;
		this.search = "";
		this.initialized = false;
		this.subroute = undefined;
		this.availableSubroutes = {};
		this.onHashChange();
		this.fetch();
	}

	static get properties() {
		return {
			...super.properties,
			gitlabProjectId: {
				type: String,
				notify: true,
				reflect: true
			},
			authenticated: {
				type: Boolean,
				notify: true
			},
			gitlabUser: {
				type: Object,
				notify: true
			},
			search: {
				type: String,
				notify: true
			},
			forceSidebarVisible: {
				type: Boolean
			},
			initialized: {
				type: Boolean
			},
			subroute: {
				type: String
			},
			availableSubroutes: {
				type: Object
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
			const hashFragments = hash.split("/", 2);

			if (hashFragments[0] === "new") {
				this.gitlabProjectId = "new";
			} else {
				this.gitlabProjectId = parseInt(hashFragments[0], 10) || null;
			}
			this.subroute = hashFragments[1];
			this.forceSidebarVisible = false;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("gitlabProjectId") && this.gitlabProjectId !== null) {
			this.search = "";
		}
		if (keys.includes("gitlabProjectId")) {
			this.availableSubroutes = {};
		}
	}

	get onClickSidebarToggle() {
		return (e) => {
			this.forceSidebarVisible = !this.forceSidebarVisible;
		}
	}

	get baseUrl() {
		return super.baseUrl + `user`;
	}

	async fetch() {
		await super.fetch(this.baseUrl, undefined, {
			redirect: "error"
		}).then((data) => {
			this.gitlabUser = data;
		}).catch((e) => {
			this.gitlabUser = null;
		}).finally(() => {
			this.initialized = true;
		})
	}

	static get styles() {
		return css`
		a.gitlab-user {
			--line-height: 24px;
			line-height: var(--line-height);
			text-decoration: none;
		}

		main {
			overflow-y: scroll;
		}
		`;
	}

	render() {

		let view, layout = "sidebar";

		if (!this.initialized) {
			view = html`
			<div class="d-none px-4 py-5 my-5 text-center">
				<img class="d-block mx-auto mb-4" src="images/favicon-180x180.png" alt="ROS Logo" width="180" height="180">
				<h1 class="display-5 fw-bold">Dashboard</h1>
				<div class="col-lg-6 mx-auto mt-4">
					<div class="spinner-border" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			</div>
			`;
			layout = "plain";
		} else if (!this.gitlabUser) {
			const loginUrl = `https://login.${window.location.host.split(".").splice(1).join(".")}/users/sign_in?redirect_to=${encodeURIComponent(window.location.href)}`;
			view = html`
			<div class="px-4 py-5 my-5 text-center">
				<img class="d-block mx-auto mb-4" src="images/favicon-180x180.png" alt="ROS Logo" width="180" height="180">
				<h1 class="display-5 fw-bold">Dashboard</h1>
				<div class="col-lg-6 mx-auto">
					<p class="lead mb-4">
						Welcome to Radically Open Security! Please authenticate to proceed to your project dashboard or get in touch with us to get started.
					</p>
					<div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
						<a href="${loginUrl}" role="button" class="btn btn-primary btn-lg px-4 me-sm-3">Login</a>
						<a href="https://www.radicallyopensecurity.com" role="button" class="btn btn-outline-secondary btn-lg px-4">Get in touch</a>
					</div>
				</div>
			</div>
			`;
			layout = "plain";
		} else if (this.gitlabProjectId === "new") {
			view = html`<ros-project-new></ros-project-new>`;
		} else if (this.gitlabProjectId !== null) {
			view = html`<ros-project
				.gitlabProjectId="${parseInt(this.gitlabProjectId, 10)}"
				.subroute="${this.subroute}"
				.availableSubroutes="${this.sync('availableSubroutes')}"
			></ros-project>`;
		} else {
			view = html`<ros-overview
					.params=${{search: this.search, order_by: "last_activity_at"}}
					perPage="20"
				></ros-overview>`;
		}

		const stylesheetIncludes = html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>`;

		const header = html`
		<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap shadow px-3">

			<a class="navbar-brand text-center me-auto safe-margin-left" href="#">
				<span class="d-none d-sm-inline">Radically Open Security</span>
				<span class="d-sm-none">R\u2661S</span>
			</a>

			<div class="safe-margin-right d-flex flex-row">
				${(this.initialized && this.gitlabUser) ? html`
					<ul class="navbar-nav ms-3">
						<li class="nav-item text-nowrap">
							<div class="nav-link" href="#">
								<a class="gitlab-user" href="/${this.gitlabUser.username}" target="_blank">
									<gitlab-avatar .user="${this.gitlabUser}"></gitlab-avatar>
									<span class="ms-1 text-white">${this.gitlabUser.name}</span>
								</a>
							</div>
						</li>
					</ul>

					<button @click="${this.onClickSidebarToggle}" class="navbar-toggler collapsed d-md-none ms-2" type="button" aria-expanded="false" aria-label="Toggle Sidebar">
						<span class="navbar-toggler-icon"></span>
					</button>
				` : ''}
			</div>
		</header>`;

		const footerHeight = "55px";
		const footerNavigationItemCount = Object.keys(this.availableSubroutes).length;
		const footerHeightStyles = styleMap({
			height: footerHeight
		});
		const footerStyles = styleMap({
			height: footerHeight,
			maxHeight: (footerNavigationItemCount > 0) ? footerHeight : 0,
			transition: 'max-height 0s ease-in',
			transitionDelay: '0.2s'
		});
		const footerAnimationStyles = styleMap({
			height: footerHeight,
			maxHeight: (footerNavigationItemCount > 0) ? footerHeight : 0,
			transition: 'max-height 0.2s ease-in',
			position: 'absolute',
			right: 0,
			bottom: 0,
			left: 0
		});
		const footer = html`
		<footer style="${footerStyles}" count="${footerNavigationItemCount}" class="d-sm-none">
			<div style="${footerAnimationStyles}">
				<nav class="navbar navbar-expand navbar-dark bg-dark p-0" style="${footerHeightStyles}">
					<div class="container-fluid">
						<ul class="navbar-nav d-flex justify-content-between w-100 px-2">
							${Object.entries(this.availableSubroutes).map(([subroute, subrouteOptions], i) => {
								const $li = document.createElement("li");
								$li.classList.add("nav-item", "text-nowrap");

								const $a = document.createElement("a");
								$a.classList.add("nav-link", "py-3");
								$a.href = `#${this.gitlabProjectId}/${subroute}`;

									const $icon = document.createElement("ui-icon");
									$icon.setAttribute("icon", subrouteOptions.icon);
									$a.appendChild($icon);

									const $text = document.createElement("span");
									$text.innerText = subrouteOptions.title;
									$a.appendChild($text);

								const isActiveRoute = (subroute === this.subroute);
								const isDefaultActiveRoute = (this.subroute == undefined) && (i === 0);

								if (isActiveRoute || isDefaultActiveRoute) {
									$a.setAttribute("aria-current", "page");
									$a.classList.add("active");
								} else {
									$a.classList.remove("active");
								}

								$li.appendChild($a);
								return $li;
							})}
						</ul>
					</div>
				</nav>
			</div>
		</footer>`;

		switch (layout) {
			case "plain":
				return html`${stylesheetIncludes}
				<div class="d-flex flex-column h-100">
					${header}
					<main class="flex-grow-1">${view}</main>
					${footer}
				</div>`;
			default: // sidebar
				return html`${stylesheetIncludes}<div class="d-flex flex-column h-100">
					${header}
					<sidebar-view .search="${this.sync('search')}" .forceSidebarVisible="${this.sync('forceSidebarVisible')}" class="flex-grow-1 position-relative">
						${view}
					</sidebar-view>
					${footer}
				</div>`;
		}

	}

}
customElements.define("app-router", AuthenticatedRouter);
