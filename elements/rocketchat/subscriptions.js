import { LitElement, html } from '../../web_modules/lit.js';

class Rocketchat extends LitElement {

	get apiBaseUrl() {
		return "https://chat.radicallyopensecurity.com/api/v1"
	}

	async fetch(endpoint) {
		const url = `${this.apiBaseUrl}/${endpoint}`
		return fetch(url, {
			mode: "cors",
			credentials: "include"
		}).then((response) => response.json());
	}

}

class RocketchatSubscriptions extends Rocketchat {

	constructor() {
		super();
		this.unread = [];
		this.query();
	}

	static get queryInterval() {
		return 30 * 1000; // milliseconds
	}

	get cronEvent() {
		return (e) => {
			this.query();
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this._interval = setInterval(this.cronEvent, this.constructor.queryInterval);
	}

	disconnectedCallback() {
		clearInterval(this._interval);
	}

	static get properties() {
		return {
			unread: {
				type: Array
			}
		};
	}

	async query() {
		const rooms = (await this.fetch("subscriptions.get")).update
			.filter((update) => update.t === "p") // rooms only

		this.unread = rooms
			.filter((update) => !!update.alert);
	}

	render() {
		return html`
			<ul>
				${this.unread.map((unreadSubscription) => html`
					<li>${unreadSubscription.name}</li>
				`)}
			</ul>
		`;
	}

}
customElements.define("rocketchat-subscriptions", RocketchatSubscriptions);
