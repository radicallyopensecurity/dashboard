import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';

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
			<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
			<table class="table">
				<tr>
					<th>ID</th>
					<th>Namespace</th>
					<th>Project</th>
					<th>Start</th>
					<th>End</th>
					<th>Report Due</th>
					<th>Report Versions</th>
				</tr>
				${this.projects.map((project) => {

					let columnClasses = {
						foo: true
					};
					const today = moment().hours(0).minutes(0).seconds(0);

					let start = "-";
					let end = "-";
					let due = "-";

					const offerte = project.offerte;
					const report = project.report;

					return html`
					<tr class="${classMap(columnClasses)}">
						<td>${project.id}</td>
						<td>${project.namespace.name}</td>
						<td>${project.name}</td>
						<td>${offerte.start}</td>
						<td>${offerte.end}</td>
						<td>${offerte.report_due}</td>
						<td>${report.version_history}</td>
					</tr>
					`;
				})}
			</table>
		`
	}

}

customElements.define("ros-projects-table", ProjectsTable);