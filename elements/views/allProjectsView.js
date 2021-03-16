import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import "../ros/projects.js";

class AllProjectsView extends LitElement {

	static get styles() {
		return css`
		.small {
			font-size: 0.75em;
		}
		`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="style.css"/>
		<h2>Your Recent Projects</h2>
		<ros-projects
			.params=${{search: "pen-", order_by: "last_activity_at"}}
			perPage="20"
		></ros-projects>
		`;
	}

}
customElements.define("ros-all-projects-view", AllProjectsView);
