import { LitElement, html } from '../../web_modules/lit-element.js';
import { LitSync, LitNotify } from '../../web_modules/@morbidick/lit-element-notify.js';
import { GitlabProject, gitlabAuth } from '../gitlab/index.js';
import { DropdownInput } from '../ui/input/dropdown.js';
import '../ros/project/member-chooser.js';

const PM_GROUP_PATH = "pm";
const TEMPLATE_GROUP_PATH = "pentext";

class GitlabNamespaceChooser extends DropdownInput {

	constructor() {
		super();
		this.path = "/api/v4/groups";
		this.params = {
			all_available: true,
			min_acces_level: 40
		}
	}

	static mapOptions(item) {
		return {
			value: item.id,
			label: item.full_path
		}
	}

	async query(url) {
		const _url = (url === undefined) ? this.url : url;
		const groups = await super.query(url);
		const enhancedGroups = await Promise.all(
			groups
				.filter((group) => ![PM_GROUP_PATH, TEMPLATE_GROUP_PATH].includes(group.label))
				.map(async (group) => { // enhance data with group details
					const groupUrl = new URL(`${this.path}/${group.value}`, window.location.toString());
					const response = await fetch(groupUrl.toString());
					const data = await response.json();
					return data;
				})
		);

		// groups listed must have the project topic/tag set
		return enhancedGroups
			.filter((group) => group.shared_with_groups.some((sharedGroup) => {
				return sharedGroup.group_full_path == PM_GROUP_PATH;
			}))
			.map(this.constructor.mapOptions); // map again
	}

}
customElements.define("gitlab-namespace-chooser", GitlabNamespaceChooser);

class GitlabTemplateChooser extends DropdownInput {

	static get properties() {
		return {
			...super.properties,
			topic: {
				type: String,
				notify: true
			}
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("topic")) {
			const options = this.options;
			if (options !== undefined && !!this.options.length) {
				this.value = options[0].value;
			}
		}
	}

	get options() {
		if (this.topic == undefined) {
			return this._options;
		}
		return this._options.filter((option) => option.tag_list.includes(this.topic));
	}

	set options(options) {
		this._options = options;
	}

	constructor() {
		super();
		this.path = `/api/v4/groups/${TEMPLATE_GROUP_PATH}/projects`;
		this.params = {
			scope: "projects",
			per_page: 100
		};
	}

	static mapOptions(item) {
		return {
			value: item.http_url_to_repo,
			label: item.name,
			tag_list: item.tag_list
		}
	}

}
customElements.define("gitlab-template-chooser", GitlabTemplateChooser);

class NewRosProject extends LitSync(GitlabProject) {

	constructor() {
		super();
		this.topic = "offerte";
		this.title = "";
		this.namespace_id = undefined;
		this.import_url = undefined;
	}

	static get properties() {
		return {
			title: {
				type: String
			},
			namespace_id: {
				type: Number
			},
			import_url: {
				type: String
			},
			topic: {
				type: String // pentest, offerte, ...
			}
		};
	}

	get onSubmitForm() {
		return async (e) => {
			e.preventDefault();
			e.stopPropagation();

			const import_url = new URL(this.import_url);
			import_url.username = "gitlab-ci-token";
			import_url.password = gitlabAuth.token;

			const createOptions = {
				import_url: import_url.toString(),
				default_branch: "main",
				wiki_access_level: "disabled",
				pages_access_level: "disabled",
				issues_access_level: "private",
				path: this.slug,
				packages_enabled: false,
				namespace_id: this.namespace_id
			}

			const nextYear = new Date();
			nextYear.setFullYear(nextYear.getFullYear() + 1);

			const project = await this.post("/api/v4/projects", {}, {
				body: JSON.stringify(createOptions)
			});
			const accessTokenResponse = await this.post(`/api/v4/projects/${project.id}/access_tokens`, {}, {
				body: JSON.stringify({
					scopes: ["api"],
					name: "CI",
					expires_at: nextYear
				})
			});

			// ToDo after 2021-03-22 release fixing https://gitlab.com/gitlab-org/gitlab/-/merge_requests/55408
			const projectAccessTokenVariableResponse = await this.post(`/api/v4/projects/${project.id}/variables`, {}, {
				body: JSON.stringify({
					key: "PROJECT_ACCESS_TOKEN",
					value: accessTokenResponse.token,
					protected: false,
					masked: true
				})
			});

			window.location.hash = project.id.toString();
		}
	}

	get prefix() {
		return `${this.topic.substr(0,3)}-`;
	}

	get slug() {
		return `${this.prefix}${this.title}`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<form name="new" @submit="${this.onSubmitForm}">
			<legend>Create New Project</legend>
			<div class="row mb-3">
				<label class="col-3 col-form-label">Namespace</label>
				<div class="col-9">
					<gitlab-namespace-chooser label="Namespace" .value="${this.sync('namespace_id')}"></gitlab-namespace-chooser>
				</div>
			</div>
			<div class="row mb-3">
				<label class="col-3 col-form-label" for="repository">Project</label>
				<div class="col-9">
					<div class="input-group">
						<span class="input-group-text">off-</span>
						<input type="text" name="title"
							aria-label="Name"
							id="repository"
							class="form-control"
							value="${this.title}"
							@change="${this.onChangeInput}"
							placeholder="my-new-project"
						/>
					</div>
				</div>
			</div>
			<div class="row mb-3">
				<label class="col-3 col-form-label">Template</label>
				<div class="col-9">
					<gitlab-template-chooser label="Template" .value="${this.sync('import_url')}" .topic="${this.topic}"></gitlab-template-chooser>
				</div>
			</div>
			<div class="row mb-3 d-none">
				<label class="col-3 col-form-label">Members</label>
				<div class="col-9">
					<ros-project-member-chooser label="Members" .gitlabProjectId="${this.gitlabProjectId}" .value="${this.sync('next_member')}" .topic="${this.topic}"></ros-project-member-chooser>
				</div>
			</div>
			<div class="row mb-3">
				<div class="offset-3">
					<button class="btn btn-primary mb-3" type="submit" .disabled="${!this.valid}">Create</button>
				</div>
			</div>
		</form>
		`;
	}

	get valid() {
		if (this.title && this.title.length) {
			return true;
		}
		return false;
	}

	get onChangeInput() {
		return (e) => {
			e.stopPropagation();
			this[e.target.name] = e.currentTarget.value;
		}
	}

	get onChangeSelection() {
		return (e) => {
			e.stopPropagation();
			this[e.currentTarget.name] = e.currentTarget.value;
		};
	}

}
customElements.define("ros-project-new", NewRosProject);