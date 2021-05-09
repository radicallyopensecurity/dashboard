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
		this.pageTitle = undefined;
		this.gitlabProjectData = null;
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
			gitlabProjectData: {
				type: Object
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
			},
			pageTitle: {
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
		if (keys.includes("gitlabProjectId")) {
			if (this.gitlabProjectId !== null) {
				this.search = "";
			} else {
				this.gitlabProjectData = null;
			}
			this.availableSubroutes = {};
		}
		if (keys.includes("pageTitle")) {
			let pageTitle = "R\u2661S";
			if (this.pageTitle !== undefined) {
				pageTitle += ` _ ${this.pageTitle}`;
			} else {
				pageTitle += ' _board';
			}
			document.title = pageTitle;
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
				.pageTitle="${this.sync('pageTitle')}"
				.gitlabProjectData="${this.sync('gitlabProjectData')}"
			></ros-project>`;
		} else {
			this.pageTitle = undefined;
			view = html`<ros-overview
					.params=${{search: this.search, order_by: "last_activity_at"}}
					perPage="20"
				></ros-overview>`;
		}

		const stylesheetIncludes = html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>`;

		const header = html`
		<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap shadow px-2 px-sm-3 flex-nowrap">

			${this.gitlabProjectData != null ? html`
			<span class="navbar-nav">
				<a href="#" class="nav-link pe-2">
					<ui-icon icon="chevron-left"></ui-icon>
				</a>
			</span>
			<span class="me-auto" style="line-height: 1.4;">
				<span class="small text-secondary">${this.gitlabProjectData.namespace.name}</span>
				<br/>
				<span class="text-white">${this.gitlabProjectData.name}</span>
			</span>
			` : html`
			<span class="me-auto">
				<a class="navbar-brand text-center safe-margin-left ms-2 me-2" href="#">
					<span class="d-none d-md-inline">Radically Open Security</span>
					<span class="d-md-none">R\u2661S</span>
				</a>
				<span class="text-secondary text-nowrap" style="text-overflow: ellipsis;">${this.pageTitle}</span>
			</span>
			`}
			</span>

			<div class="safe-margin-right d-flex flex-row">
				${(this.initialized && this.gitlabUser) ? html`
					<ul class="navbar-nav ms-3">
						<li class="nav-item text-nowrap">
							<div class="nav-link" href="#">
								<a class="gitlab-user" href="/${this.gitlabUser.username}" target="_blank">
									<gitlab-avatar .user="${this.gitlabUser}"></gitlab-avatar>
									<span class="ms-1 text-white d-none d-sm-inline">${this.gitlabUser.name}</span>
								</a>
							</div>
						</li>
					</ul>

					<button @click="${this.onClickSidebarToggle}" class="navbar-toggler collapsed d-lg-none ms-2" type="button" aria-expanded="false" aria-label="Toggle Sidebar">
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
			height: `calc(${footerHeight} + env(safe-area-inset-bottom))`,
			maxHeight: (footerNavigationItemCount > 0) ? `calc(${footerHeight} + env(safe-area-inset-bottom))` : 0,
			transition: 'max-height 0s ease-out',
			transitionDelay: '0.2s',
			position: 'relative',
			display: 'block'
		});
		const footerAnimationStyles = styleMap({
			height: footerHeight,
			maxHeight: (footerNavigationItemCount > 0) ? footerHeight : 0,
			transition: 'max-height 0.2s ease-out',
			position: 'absolute',
			right: 0,
			top: 0,
			left: 0
		});

		const footer = html`
		<footer style="${footerStyles}" count="${footerNavigationItemCount}" class="d-sm-none bg-dark">
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
