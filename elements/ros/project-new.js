import { LitElement, html } from '../../web_modules/lit-element.js';
import { LitSync, LitNotify } from '../../web_modules/@morbidick/lit-element-notify.js';
import { GitlabProject } from '../gitlab/index.js';


class DropdownInput extends LitNotify(LitElement) {

	constructor() {
		super();
		this.url = undefined;
		this.value = undefined;
		this.options = [];
	}

	static get properties() {
		return {
			url: {
				type: String
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

	updated(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("url")) {
			this.query();
		}
		if (keys.includes("options") && !keys.includes("value")) {
			if ((this.value === undefined) && (this.options.length > 0)) {
				this.value = this.options[0].value
			}
		}
	}

	async query() {
		if (this.url === undefined) {
			return;
		} else {
			const response = await fetch(this.url);
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

			this.options = data.map(this.constructor.mapOptions);
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
		this.url = "/api/v4/groups";
	}

	static mapOptions(item) {
		return {
			value: item.id,
			label: item.path
		}
	}

}
customElements.define("gitlab-namespace-chooser", GitlabNamespaceChooser);

class NewRosProject extends LitSync(GitlabProject) {

	constructor() {
		super();
		this.title = ""
		this.namespace_id = 5;
	}

	get type() {
		return "pentest";
	}

	get prefix() {
		return "pen-";
	}

	get import_url() {
		return "https://github.com/radicallyopensecurity/pentext-project"
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

			const createOptions = {
				import_url: this.import_url,
				default_branch: "main",
				wiki_access_level: "disabled",
				pages_access_level: "disabled",
				issues_access_level: "private",
				path: this.slug,
				packages_enabled: false,
				namespace_id: this.namespace_id
			}

			const response = await this.post("/api/v4/projects", {}, {
				body: JSON.stringify(createOptions)
			});

			if (200 >= response.status < 300) {
				const data = await response.json();
				window.location.hash = data.id.toString();
			}
		}
	}

	get slug() {
		return `${this.prefix}${this.title}`;
	}

	render() {
		return html`
		<h2>New Project</h2>
		<form name="new" @submit="${this.onSubmitForm}">
			<gitlab-namespace-chooser .value="${this.sync('namespace_id')}"></gitlab-namespace-chooser>
			<select name="prefix">
				<option>pen-</option>
				<option>off-</option>
			</select>
			<input type="text" name="title" value="${this.title}" @change="${this.onChangeInput}" placeholder="my-new-project" />
			<button type="submit">Create</button>
		</form>
		`;
	}

	get onChangeInput() {
		return (e) => {
			e.stopPropagation();
			this[e.target.name] = e.currentTarget.value;
		}
	}

}
customElements.define("ros-project-new", NewRosProject);