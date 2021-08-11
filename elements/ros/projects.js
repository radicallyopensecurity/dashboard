import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { GitlabProjects } from '../gitlab/projects.js';

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

	static getAvatarUrl(project) {
		return project.avatar_url || project.namespace.avatar_url;
	}

	static get styles() {
		return css`
		.small {
			font-size: 0.75em;
		}

		.avatar {
			width: 48px;
			height: 48px;
		}
		`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>

		<div class="col-12 bg-light">
			<div class="my-3 p-3 bg-body rounded shadow-sm bg-body">

				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap pt-3 pb-2 mb-3 border-bottom">
					<h1>Projects</h1>
					${this.loading ? html`
						<div class="spinner-border mb-2" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					`: ''}
				</div>
				<div class="row">
					<div class="col-12 col-lg-8 col-xl-6">
						 ${this.projects.length > 0 ? html`
							 <div class="list-group">
								${this.projects.map((project) => html`
									<a href="#${project.id}" class="list-group-item list-group-item-action d-flex align-items-center" aria-current="true" >
										<img class="avatar me-3" src="${this.constructor.getAvatarUrl(project)}" />
										<div class="w-100">
											<div class="d-flex w-100 justify-content-between">
												<div>
													<h5 class="mb-2">${project.name_with_namespace}</h5>
												</div>
												<small>
													Updated
													${moment(project.last_activity_at).fromNow()}
												</small>
											</div>
											<p class="mb-1">
												Created at ${moment(project.created_at).format("LL")}
											</p>
										</div>
									</a>
								`)}
							 </div>
						`: (!this.loading) ?
							html`<p>No projects found</p>`: ''}
					</div>
				</div>
			</div>
		</div>`;
	}

}
customElements.define("ros-projects", Projects);
