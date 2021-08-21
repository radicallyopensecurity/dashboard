import { LitElement, html } from '../../web_modules/lit.js';
import { LitNotify } from '../../lib/lit-element-notify.js';

class Rocketchat extends LitElement {

	constructor() {
		super();
		this.lastUpdated = null;
	}

	static get properties() {
		return {
			lastUpdated: {
				type: Date,
				notify: true
			}
		}
	}

	get apiBaseUrl() {
		return "https://chat.radicallyopensecurity.com/api/v1/";
	}

	async fetch(endpoint, queryParams) {
		const url = new URL(endpoint, this.apiBaseUrl);
		if (queryParams !== undefined) {
			url.search = queryParams.toString();
		}
		const data = await fetch(url, {
			mode: "cors",
			credentials: "include"
		}).then((response) => response.json());
		this.lastUpdated = new Date();
		return data;
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
		return async (e) => {
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
			...super.properties,
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
		const searchParams = new URLSearchParams();
		if (this.lastUpdated instanceof Date) {
			searchParams.append("updatedSince", this.lastUpdated.toString());
		}
		const rooms = (await this.fetch("subscriptions.get", searchParams)).update
			.filter((update) => update.t === "p") // rooms only

		const oldSubscriptions = this.subscriptions;
		const knownSubscriptions = this.subscriptions;
		for (let updatedRoom of rooms) {
			let currentSubscription = knownSubscriptions.findIndex((subscription) => subscription._id === updatedRoom._id);
			if (currentSubscription !== -1) {
				knownSubscriptions[currentSubscription] = updatedRoom;
			} else {
				knownSubscriptions.unshift(updatedRoom);
			}
		}
		this.subscriptions = [...knownSubscriptions];
		this.unread = knownSubscriptions
			.filter((update) => !!update.alert);

		this.querying = false;
	}

}
customElements.define("rocketchat-subscriptions", RocketchatSubscriptions);
