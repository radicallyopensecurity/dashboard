import { LitElement, html } from '../../../web_modules/lit-element.js';
import { LitNotify } from '../../../web_modules/@morbidick/lit-element-notify.js';

export class AutocompleteInput extends LitNotify(LitElement) {

	constructor() {
		super();
		this.path = undefined;
		this.value = undefined;
		this.params = {
			scope: "users"
		};
		this._options = [];
		this.search = "";
		this.suggestions = null;
	}

	static get properties() {
		return {
			path: {
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
				type: Object,
				notify: true
			},
			search: {
				type: String,
				notify: true
			},
			suggestions: {
				type: Array
			}
		}
	}

	get options() {
		return this._options;
	}

	set options(options) {
		this._options = options;
	}

	get url() {
		if (this.path == undefined) {
			return;
		}
		const url = new URL(this.path, window.location.toString());
		Object.entries(this.params)
			.forEach(([key, value]) => url.searchParams.append(key, value));
		url.searchParams.append("search", this.search);
		return url;
	}

	async queryDebounced(duration=50) {

		if (this.__queryTimeout !== undefined) {
			clearTimeout(this.__queryTimeout);
		}

		this.__queryTimeout = setTimeout(async () => {
			this.options = await this.query();
		}, duration);

	}


	updated(changedProperties) {
		const keys = [...changedProperties.keys()];
		if (keys.includes("path") || keys.includes("params")) {
			this.queryDebounced(0);
		} else if (keys.includes("search")) {
			this.queryDebounced();
		}
		if (keys.includes("_options") && !keys.includes("value")) {
			if ((this.value === undefined) && (this.options.length > 0)) {
				this.value = this.options[0].value
			}
		}
	}

	async query(url) {
		if ((this.search === undefined) || !this.search.length) {
			return [];
		}
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

			this.options = data.map(this.constructor.mapOptions);
		}
	}

	static mapOptions(item) {
		return item;
	}

	get onChangeInput() {
		return (e) => {
			e.stopPropagation();
			this[e.currentTarget.name] = e.currentTarget.value;
		};
	}

	select(option) {
		return (e) => {
			this.value = option;
		};
	}

	render() {
		return html`
		<input type="search" name="search" @change="${this.onChangeInput}"/>
		${this.options !== null ? html`
			<ul id="suggestions">
				${this.options.map((suggestion) => html`
					<li @click="${this.select(this.suggestion)}">${this.suggestion.name}</li>
				`)}
			</ul>
		` : ''}
		`;
	}

}