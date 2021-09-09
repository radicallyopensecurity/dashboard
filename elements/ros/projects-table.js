import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';

class ProjectsTable extends LitElement {

	constructor() {
		super();
		this.projects = [];
	}

	static get properties() {
		return {
			projects: {
				type: Array
			}
		}
	}

	render() {

		if (this.projects.length === 0) {
			return html`
				<div>No Projects found.</div>
			`;
		}

		return html`
			<table>
				<tr>
					<th>ID</th>
					<th>Namespace</th>
					<th>Project</th>
					<th>Start</th>
					<th>End</th>
					<th>Report Due</th>
				</tr>
				${this.projects.map((project) => html`
					<tr>
						<td>${project.id}</td>
						<td>${project.namespace.name}</td>
						<td>${project.name}</td>
						<td>-</td>
						<td>-</td>
						<td>-</td>
					</tr>
				`)}
			</table>
		`
	}

}

customElements.define("ros-projects-table", ProjectsTable);