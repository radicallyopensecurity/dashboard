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

		<div class="container-fluid h-100 d-block overflow-scroll pb-5 pe-3">
			<div class="row mx-0">
				<nav id="sidebar" class="col-md-3 col-xl-2 pt-5 d-md-block bg-body sidebar collapse shadow-md">
					<div class="position-sticky mx-1 mt-4 mb-1 safe-offset-left">
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

				<main class="col-md-9 col-xl-10 offset-md-3 offset-xl-2 mt-3 ps-0 safe-offset-right">
					<slot></slot>
				</main>
			</div>
		</div>
		`;
	}

}
customElements.define("sidebar-view", SidebarView);
