import { LitElement, html } from '../../web_modules/lit-element.js';
import { LitSync, LitNotify } from '../../web_modules/@morbidick/lit-element-notify.js';
import { GitlabProject, gitlabAuth } from '../gitlab/index.js';

const PM_GROUP_PATH = "pm";
const TEMPLATE_GROUP_PATH = "pentext";

class DropdownInput extends LitNotify(LitElement) {

	constructor() {
		super();
		this.path = undefined;
		this.params = {};
		this.value = undefined;
		this.options = [];
	}

	static get properties() {
		return {
			path: {
				type: String
			},
			params: {
				type: Object
			},
			options: {
				type: Object,
				notify: true
			},
			value: {
				type: String,
				notify: true
			}
		}
	}

	get url() {
		if (this.path == undefined) {
			return;
		}
		const url = new URL(this.path, window.location.toString());
		Object.entries(this.params).forEach(([key, value]) => url.searchParams.append(key, value));
		return url;
	}

	async updated(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("path") || keys.includes("params")) {
			this.options = await this.query();
		}
		if (keys.includes("options") && !keys.includes("value")) {
			if ((this.value === undefined) && (this.options.length > 0)) {
				this.value = this.options[0].value
			}
		}
	}

	async query(url) {
		if (url === undefined) {
			url = this.url;
		}
		if (url === undefined) {
			return;
		} else {
			const response = await fetch(url.toString());
			const data = await response.json();

			switch (response.status) {
				case 401:
				case 403:
					alert(data.message);
					break;
				case 400:
					alert(data.message.name);
					break;
			}

			return data.map(this.constructor.mapOptions);
		}
	}

	static mapOptions(item) {
		return item;
	}

	onChangeSelection(e) {
		e.stopPropagation();
		this.value = e.currentTarget.value;
    }

	render() {
		return html`
		<link rel="stylesheet" href="style.css"/>
		<select @change="${this.onChangeSelection}">
			${this.options.map((option) => {
				const label = option.label || option.value;
				return html`<option value="${option.value}" .selected="${option.value === this.value}">${label}</option>`;
			})}
		</select>
		`;
	}

}

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
			label: item.path
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
			label: item.name
		}
	}

}
customElements.define("gitlab-template-chooser", GitlabTemplateChooser);

class NewRosProject extends LitSync(GitlabProject) {

	constructor() {
		super();
		this.title = "";
		this.namespace_id = 5; // ros group on git.staging.radical.sexy
		this.import_url = undefined;
	}

	get type() {
		return "pentest";
	}

	get prefix() {
		return "pen-";
	}

	static get properties() {
		return {
			prefix: {
				type: String
			},
			title: {
				type: String
			},
			namespace_id: {
				type: Number
			},
			import_url: {
				type: String
			}
		};
	}

	get onSubmitForm() {
		return async (e) => {
			e.preventDefault();
			e.stopPropagation();

			const form = e.target;
			const prefix = form.prefix.value;
			const title = form.title.value.trim();

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

			let response;
			try {
				response = await this.post("/api/v4/projects", {}, {
					body: JSON.stringify(createOptions)
				});
				access_token = await this.post(`/api/v4/projects/${response.id}/access_tokens`, {}, {
					body: JSON.stringify({
						scopes: ["api"],
						name: "webhooker"
					})
				});
			} catch(e) {
				alert(e.message);
				return;
			}

			window.location.hash = response.id.toString();
		}
	}

	get slug() {
		return `${this.prefix}${this.title}`;
	}

	render() {
		return html`
		<link rel="stylesheet" href="style.css"/>
		<link rel="stylesheet" href="flexboxgrid.css"/>
		<h2>Create New Project</h2>
		<form name="new" @submit="${this.onSubmitForm}">
			<div class="row">
				<div class="col-xs-3">Namespace</div>
				<div class="col-xs-9">
					<gitlab-namespace-chooser .value="${this.sync('namespace_id')}"></gitlab-namespace-chooser>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-3">Repository</div>
				<div class="col-xs-9">
					<select name="prefix">
						<option>pen-</option>
						<option>off-</option>
					</select>
					<input type="text" name="title" value="${this.title}" @change="${this.onChangeInput}" placeholder="my-new-project" />
				</div>
			</div>
			<div class="row">
				<div class="col-xs-3">Template</div>
				<div class="col-xs-9">
					<gitlab-template-chooser .value="${this.sync('import_url')}"></gitlab-template-chooser>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-offset-3 col-xs-9">
					<button type="submit" .disabled="${!this.valid}">Create</button>
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

}
customElements.define("ros-project-new", NewRosProject);