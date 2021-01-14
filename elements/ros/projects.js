import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProjects } from '../gitlab/index.js';

class Projects extends GitlabProjects {

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
					</li>
				`)}
			</ul>
		`}`;
	}

}
customElements.define("ros-projects", Projects);
