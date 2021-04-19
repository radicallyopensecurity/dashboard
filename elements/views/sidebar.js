import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { LitSync } from '../../web_modules/@morbidick/lit-element-notify.js';
import "../ros/projects.js";

class SidebarView extends LitSync(LitElement) {

	constructor() {
		super();
		this.search = "";
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
			}
		}
	}

	get onChangeSearchInput() {
		return (e) => {
			this.search = e.target.value;
			window.location.hash = '';
		};
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="container-fluid">
			<div class="row">
				<nav id="sidebarMenu" class="col-md-3 col-xl-2 d-md-block bg-body sidebar collapse">
					<div class="position-sticky pt-3">
						<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1">
							<span>Search</span>
						</h6>
						<input id="search" name="search"
							@input=${this.onChangeSearchInput}
							.value="${this.search}"
							class="form-control form-control-dark w-100" type="text"
							placeholder="Search"
							aria-label="Search" />
						<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
							<span>Actions</span>
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
									Start New Project
								</a>
							</li>
						</ul>
						<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
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

				<main class="col-md-9 col-xl-10 offset-md-3 offset-xl-2">
					<slot></slot>
				</main>
			</div>
		</div>
		`;
	}

}
customElements.define("sidebar-view", SidebarView);
