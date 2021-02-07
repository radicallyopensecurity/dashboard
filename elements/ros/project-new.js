import { LitElement, html, css } from '../../web_modules/lit-element.js';
import { GitlabProject } from '../gitlab/index.js';

class NewRosProject extends GitlabProject {

	constructor() {

	}

	get type() {
		return "pentest";
	}

	get prefix() {
		return "pen-";
	}

	get namespace_id() {
		// ToDo: provide chooser instead of hardcoded value
		return 5;
	}

	get import_url() {
		return "https://github.com/radicallyopensecurity/pentext-project"
	}

	static get properties() {
		return {
			prefix: {
				type: String
			}
			title: {
				type: String
			}
		};
	}

	get onSubmitForm() {
		return (e) => {
			e.preventDefault();
			e.stopPropagation();

			const form = e.target;
			const prefix = form.prefix.value;
			const title = form.title.value.trim();

			const slug = `${prefix}${title}`;

			const createOptions = {
				import_url: this.import_url,
				default_branch: "main",
				wiki_access_level: "disabled",
				pages_access_level: "disabled",
				issues_access_level: "private",
				path: slug,
				packages_enabled: false,
				namespace_id: this.namespace_id
			}

			this.post(this.baseUrl, {}, {
				body: JSON.stringify(createOptions)
			});
		}
	}

	create() {

	}

	render() {
		<h2>New Project</h2>
		<form name="new" @submit="${this.onSubmitForm}">
			<select name="prefix">
				<option>pen-</option>
				<option>off-</option>
			</select>
			<input type="text" name="title" value="" placeholder="my-new-project" />
			<button type="submit">Create</button>
		</form>
	}

}
customElements.define("ros-project-new", NewRosProject);