import { LitElement, html } from '../../../web_modules/lit.js';
import { LitNotify } from '../../../lib/lit-element-notify.js';

export class DropdownInput extends LitNotify(LitElement) {

	constructor() {
		super();
		this.path = undefined;
		this.label = undefined;
		this.params = {};
		this.value = null;
		this._options = [];
	}

	static get properties() {
		return {
			path: {
				type: String
			},
			label: {
				type: String
			},
			params: {
				type: Object
			},
			_options: {
				type: Object,
				notify: true
			},
			value: {
				type: String,
				notify: true
			}
		}
	}

	get options() {
		return this._options;
	}

	set options(options) {
		const oldValue = this._options;
		this._options = options;
		this.requestUpdate("options", oldValue);
	}

	get url() {
		if (this.path == undefined) {
			return;
		}
		const url = new URL(this.path, window.location.toString());
		Object.entries(this.params).forEach(([key, value]) => url.searchParams.append(key, value));
		return url;
	}

	async willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has("path") || changedProperties.has("params")) {
			this.options = await this.query();
		}
		if (changedProperties.has("_options") && !changedProperties.has("value")) {
			if ((this.value == undefined) && (this.options.length > 0)) {
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

	get onChangeSelection() {
		return (e) => {
			e.stopPropagation();

			if (this.constructor.properties.value.type === Number) {
				this.value = parseInt(e.currentTarget.value, 10);
			} else {
				this.value = e.currentTarget.value;
			}
		}
	}

	render() {
		return html`
		<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="dashboard.css"/>

		<div class="form-floating">
			<select @change="${this.onChangeSelection}"
				class="form-select"
				id="userSelection"
				aria-label="${this.label}"
			>${this.options.map((option) => html`
				<option
					value="${option.value}"
					.selected="${option.value === this.value}"
				>${option.label || option.value}</option>
			`)}</select>
			${(this.label !== undefined) ? html`<label for="userSelection">${this.label}</label>` : ''}
		</div>
		`;
	}

}