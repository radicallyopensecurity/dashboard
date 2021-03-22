import { AutocompleteInput } from '../../ui/input/autocomplete.js';

class ProjectMemberChooser extends AutocompleteInput {

	constructor() {
		super();
		this.path = "/api/v4/search";
	}

	static get properties() {
		return {
			...super.properties,
			gitlabProjectId: {
				type: Number
			}
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const keys = [...changedProperties.keys()];
		if (keys.includes("value") && this.value !== undefined) {
			addMember(this.value.id)
				.then(() => {
					this.value = undefined;
					this.suggestions = null;
				});
		}
	}

	async addMember(user_id) {
		const params = {
			access_level: 30,
			user_id: user_id
		};
		const project = await this.post(`/api/v4/projects/${this.gitlabProjectId}/members`, {}, {
			body: JSON.stringify(createOptions)
		});
	}

}
customElements.define("ros-project-member-chooser", ProjectMemberChooser);