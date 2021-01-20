import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProjects } from '../gitlab/index.js';

class Projects extends GitlabProjects {

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
		<h2>Your Projects</h2>
		${!this.projects.length ? html`
			<div>Loading ...</div>
		` : html`
			<ul>
				${this.projects.map((project) => html`
					<li>
						<a href="#${project.id}">${project.name}</a>
						<span class="small">
							${moment(project.last_activity_at).fromNow()}
						</span>
					</li>
				`)}
			</ul>
		`}`;
	}

}
customElements.define("ros-projects", Projects);
