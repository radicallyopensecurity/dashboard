import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProjects } from '../gitlab/index.js';

class Projects extends GitlabProjects {

	get search() {
		return this.params.search.substr(5);
	}

	set search(value) {
		this.params = {
			...this.params,
			search: `pen- ${value}`
		};
	}

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
		<input type="text" name="search" @input=${e => { this.search = e.target.value }} value="" placeholder="Search"></input>
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
