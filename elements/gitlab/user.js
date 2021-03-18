import { LitElement, html, css } from '../../web_modules/lit-element.js';
import {Gitlab} from "./index.js";
import "./avatar.js";

class GitlabUser extends Gitlab {

	static get styles() {
		return css`
		a {
			--line-height: 24px;
			line-height: var(--line-height);
		}
		`;
	}

	constructor() {
		super();
		this.fetch();
	}

	get baseUrl() {
		return super.baseUrl + `user`;
	}

	static get properties() {
		return {
			user: {
				type: Object,
				notify: true
			}
		}
	}

	async fetch() {
		this.user = await super.fetch();
	}

	render() {
		return html`
			<link rel="stylesheet" href="style.css"/>
			<a href="/${this.user.username}" target="_blank"><gitlab-avatar .user="${this.user}"></gitlab-avatar>${this.user.name}</a>`;
	}

}
customElements.define("gitlab-user", GitlabUser);
