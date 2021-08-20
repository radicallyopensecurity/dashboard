import { LitElement, html } from '../../web_modules/lit.js';
import { LitNotify } from '../../lib/lit-element-notify.js';

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

class RocketchatSubscriptions extends LitNotify(Rocketchat) {

	constructor() {
		super();
		this.unread = [];
		this.subscriptions = [];
		this.query();
	}

	static get queryInterval() {
		return 15 * 1000; // milliseconds
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
				type: Array,
				notify: true
			},
			subscriptions: {
				type: Array,
				notify: true
			}
		};
	}

	async query() {
		if (this.querying === true) {
			return;
		}
		this.querying = true;
		const rooms = (await this.fetch("subscriptions.get")).update
			.filter((update) => update.t === "p") // rooms only
		this.subscriptions = rooms;
		this.unread = rooms
			.filter((update) => !!update.alert);
		this.querying = false;
	}

}
customElements.define("rocketchat-subscriptions", RocketchatSubscriptions);
