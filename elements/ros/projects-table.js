import moment from '../../web_modules/moment.js';
import { LitElement, html, css } from '../../web_modules/lit.js';
import { classMap } from '../../web_modules/lit-html/directives/class-map.js';

class ProjectsTable extends LitElement {

	constructor() {
		super();
		this.projects = [];
		this.sortedProjects = [];
		this.offertes = {};
		this.sort = undefined;
	}

	static get properties() {
		return {
			projects: {
				type: Array
			},
			sortedProjects: {
				type: Array
			},
			sort: {
				type: String
			}
		}
	}

	get sortFunction() {
		switch (this.sort) {
			case "id":
				return (a, b) => a.id > b.id ? 1 : -1;
			case "namespace":
				return (a, b) => a.namespace.name.localeCompare(b.namespace.name);
			case "name":
				return (a, b) => a.name.localeCompare(b.name);
			case "start":
				return (a, b) => {
					if (a.offerte.xmlData == null) {
						return 1;
					} else if (b.offerte.xmlData == null) {
						return -1;
					} else {
						return a.offerte.start.isBefore(b.offerte.start);
					}
				};
			default:
				return undefined;
		}
	}

	static get styles() {
		return css`
			table[sort=id] th[name=id] a,
			table[sort=namespace] th[name=namespace] a,
			table[sort=name] th[name=name] a,
			table[sort=start] th[name=start] a,
			table[sort=end] th[name=end] a,
			table[sort=report] th[name=report] a,
			table[sort=report_date] th[name=report_date] a {
				color: var(--ros-orange, red);
			}
		`;
	}

	willUpdate(changedProperties) {
		if (changedProperties.has("projects")) {
			const sortFunction = this.sortFunction;
			this.sortedProjects = (sortFunction !== undefined) ? [...this.projects.sort(sortFunction)] : this.projects;
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
			<table class="table" sort="${this.sort}">
				<tr>
					<th name="id"><a href="#table/id">ID</a></th>
					<th name="namespace"><a href="#table/namespace">Namespace</a></th>
					<th name="name"><a href="#table/name">Project</a></th>
					<th name="start"><a href="#table/start">Start</a></th>
					<th name="end"><a href="#table/end">End</a></th>
					<th name="report"><a href="#table/report">Report Due</a></th>
					<th name="report_date"><a href="#table/report_date">Latest Report Version</a></th>
				</tr>
				${this.sortedProjects.map((project) => {

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
						<td>${report.latest_version_date}</td>
					</tr>
					`;
				})}
			</table>
		`
	}

}

customElements.define("ros-projects-table", ProjectsTable);