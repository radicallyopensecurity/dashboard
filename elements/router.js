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
		if (this.gitlabProjectId !== null) {
			return html`<ros-project .gitlabProjectId="${this.gitlabProjectId}"></ros-project>`;
		} else {
			return html`<ros-all-projects-view></ros-all-projects-view>`;
		}
	}

}
customElements.define("app-router", Router);