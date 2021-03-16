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

	updateParams(key, value) {
		this.params = {
			...this.params,
			[key]: value
		};
	}

	render() {
		return html`
		<link rel="stylesheet" href="style.css"/>
		<input type="text" name="search" @input=${e => this.updateParams('search', e.target.value)} value="${this.params.search}" placeholder="Search"></input>
		${this.loading ? html`
			<p>Loading ...</p>
		`: ''}
		 ${this.projects.length > 0 ? html`
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
		`: html`<p>No projects found</p>`}`;
	}

}
customElements.define("ros-projects", Projects);
