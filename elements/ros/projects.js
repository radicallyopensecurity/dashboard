import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProjects } from '../gitlab/index.js';
import '../ui/icon.js';

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
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
			<h1>Projects</h1>
			${this.loading ? html`
				<div class="spinner-border mb-2" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			`: ''}
		</div>
		<div class="row">
			<div class="col-12">
				 ${this.projects.length > 0 ? html`
					 <div class="list-group w-50">
						${this.projects.map((project) => html`
							<a href="#${project.id}" class="list-group-item list-group-item-action" aria-current="true">
								<div class="d-flex w-100 justify-content-between">
									<h5 class="mb-2">${project.name_with_namespace}</h5>
									<small>
										${moment(project.last_activity_at).fromNow()}
										<ui-icon icon="edit"></ui-icon>
									</small>
								</div>
								<p class="mb-1">
									created at: ${moment(project.created_at).calendar()}
								</p>
							</a>
						`)}
					 </div>
				`: (!this.loading) ?
					html`<p>No projects found</p>`: ''}
			</div>
		</div>`
	}

}
customElements.define("ros-projects", Projects);
