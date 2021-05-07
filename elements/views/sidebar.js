import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { LitNotify } from '../../web_modules/@morbidick/lit-element-notify.js';
import "../ros/projects.js";

class SidebarView extends LitNotify(LitElement) {

	constructor() {
		super();
		this.search = "";
		this.forceSidebarVisible = false;
	}

	static get styles() {
		return css`
		.small {
			font-size: 0.75em;
		}

		main {
			overflow-y: scroll;
		}

		#sidebar {
			position: absolute;
			z-index: 999;
			width: 100%;
		}

		@media (min-width: 576px) {
			#sidebar {
				width: auto !important;
			}
		}

		@media (min-width: 768px) {
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
			forceSidebarVisible: {
				type: Boolean,
				notify: false
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

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="position-absolute h-100 w-100 d-block overflow-hidden">
			<div class="position-absolute w-100 h-100 mx-0 d-flex flex-row align-items-stretch">
				<nav id="sidebar" class="col-md-3 col-xl-2 d-md-block bg-body sidebar collapse shadow px-3 h-100 w-100">
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
						<h6 class="sidebar-heading text-muted">
							<span>Projects</span>
						</h6>
						<ul class="nav flex-column">
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="#">
									<ui-icon icon="bookmark"></ui-icon>
									My Projects
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="#new">
									<ui-icon icon="plus-square"></ui-icon>
									New Project
								</a>
							</li>
						</ul>

						<h6 class="sidebar-heading mt-3 text-muted">
							<span>ROS Services</span>
						</h6>
						<ul class="nav flex-column">
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="https://chat.radicallyopensecurity.com" target="_blank">
									<ui-icon icon="message-square"></ui-icon>
									Rocket.Chat
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="https://git.radicallyopensecurity.com" target="_blank">
									<ui-icon icon="gitlab"></ui-icon>
									Gitlab
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" aria-current="page" href="https://codimd.radicallyopensecurity.com" target="_blank">
									<ui-icon icon="file-text"></ui-icon>
									CodiMD
								</a>
							</li>
						</ul>
					</div>
				</nav>

				<main class="position-relative flex-grow-1 mt-0 p-0 p-sm-3 safe-margin-right">
					<slot></slot>
				</main>
			</div>
		</div>
		`;
	}

}
customElements.define("sidebar-view", SidebarView);
