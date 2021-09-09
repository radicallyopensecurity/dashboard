import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';

class ProjectsTable extends LitElement {

	constructor() {
		super();
		this.projects = [];
		this.offertes = {};
	}

	static get properties() {
		return {
			projects: {
				type: Array
			},

			offertes: {
				type: Object
			}
		}
	}

	async queryOfferte(gitlabProjectId) {
		this.offerte = null;

		const response = fetch(`/api/v4/projects/${gitlabProjectId}/repository/files/source%2Fofferte.xml?ref=main`);
		const status = await response.then((response) => response.status);
		if (status !== 200) {
			return null;
		}
		return await response
			.then(response => response.json())
			.then(filedata => atob(filedata.content))
			.then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
			.then(xmldata => {
				const planning = xmldata.getElementsByTagName("planning")[0];
				const start = planning.getElementsByTagName("start")[0].textContent;
				const end = planning.getElementsByTagName("end")[0].textContent;
				return {
					start: moment(start),
					end: moment(end)
				};
			});
	}

	async updateOffertes() {
		this.projects.forEach(async (project) => {
			if (!this.offertes.hasOwnProperty(project.id)) {
				this.offertes[project.id] = null;
				this.offertes[project.id] = await this.queryOfferte(project.id);
			}
		});
	}

	async willUpdate(changedProperties) {
		if (changedProperties.has("projects")) {
			await this.updateOffertes();
		}
	}

	render() {

		if (this.projects.length === 0) {
			return html`
				<div>No Projects found.</div>
			`;
		}

		return html`
			<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
			<table class="table">
				<tr>
					<th>ID</th>
					<th>Namespace</th>
					<th>Project</th>
					<th>Start</th>
					<th>End</th>
					<th>Report Due</th>
				</tr>
				${this.projects.map((project) => {

					let start = "-";
					let end = "-";
					let due = "-";

					if (this.offertes.hasOwnProperty(project.id) && (this.offertes[project.id] !== null)) {
						const format = "DD.MM.YYYY";
						const offerte = this.offertes[project.id];
						start = offerte.start.format(format);
						end = offerte.end.format(format);
						// due = offerte.due.format(format);
					}

					return html`
					<tr>
						<td>${project.id}</td>
						<td>${project.namespace.name}</td>
						<td>${project.name}</td>
						<td>${start}</td>
						<td>${end}</td>
						<td>${due}</td>
					</tr>
					`;
				})}
			</table>
		`
	}

}

customElements.define("ros-projects-table", ProjectsTable);