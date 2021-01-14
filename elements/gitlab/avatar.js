import { LitElement, css } from '../../web_modules/lit-element.js';

class GitlabAvatar extends LitElement {

	static get properties() {
		return {
			user: {
				type: Object
			}
		}
	}

	static get styles() {
		return css`
		.avatar {
			position: relative;
			background-repeat: no-repeat;
			background-size: cover;
			width: var(--line-height);
			height: var(--line-height);
			float: left;
			margin-right: 10px;
			border-radius: 2px;
		}
		.avatar.default {
			background-color: lightgrey;
			border-radius: calc(var(--line-height) / 2);
		}
		.author {
			display: inline;
		}
		`;
	}

	render() {
		const $avatar = document.createElement("div");
		$avatar.classList.add("avatar");
		if (this.user.avatar_url != undefined) {
			$avatar.style.backgroundImage = `url(${new URL(this.user.avatar_url)})`;
		} else {
			$avatar.classList.add("default");
		}
		return $avatar;
	}
}
customElements.define("gitlab-avatar", GitlabAvatar);