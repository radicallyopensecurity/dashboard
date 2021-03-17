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
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<div class="container-fluid">
			<div class="row">
				<div class="col-12">
					${this.loading ? html`
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					`: ''}
					 ${this.projects.length > 0 ? html`
						 <div class="list-group w-50">
							${this.projects.map((project) => html`
								<a href="#${project.id}" class="list-group-item list-group-item-action" aria-current="true">
									<div class="d-flex w-100 justify-content-between">
										<h5 class="mb-2">${project.name_with_namespace}</h5>
										<small>
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
											${moment(project.last_activity_at).fromNow()}
										</small>
									</div>
									<p class="mb-1">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
										${moment(project.created_at).calendar()} or ${moment(project.created_at).fromNow()}
									</p>
								</a>
							`)}
						 </div>
					`: (!this.loading) ?
						html`<p>No projects found</p>`: ''}
				</div>
			</div>
		</div>`
	}

}
customElements.define("ros-projects", Projects);
