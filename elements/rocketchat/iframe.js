import { LitElement, css } from '../../web_modules/lit.js';

let $sharedIframe;

class RocketchatFrame extends LitElement {

	constructor() {
		super();
		this.channel = "ros";
	}

	static get properties() {
		return {
			channel: {
				type: String,
				reflect: true
			}
		};
	}

	get chatHostname() {
		return window.location.hostname.replace(/^git\./, "chat.");
	}

	get chatChannelPath() {
		return `/group/${this.channel}?layout=embedded`;
	}

	get chatChannelUrl() {
		return `https://${this.chatHostname}${this.chatChannelPath}`;
	}

	updated(changedProperties) {
		if (changedProperties.has("channel")) {
			this.updateChannel();
		}
	}

	updateChannel() {
		if (!$sharedIframe.contentWindow) {
			// frame is not loaded yet
			$sharedIframe.src = this.chatChannelUrl;
		} else {
			$sharedIframe.contentWindow.postMessage({
				externalCommand: 'go',
				path: this.chatChannelPath
			}, "*");
		}
	}

	get $iframe() {
		if (!$sharedIframe) {
			const $iframe = document.createElement("iframe");
			$iframe.setAttribute("id", "chat");
			$iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
			$iframe.setAttribute("referrerpolicy" ,"origin");
			$iframe.src = this.chatChannelUrl;
			$sharedIframe = $iframe;
		} else {
			this.updateChannel();
		}
		return $sharedIframe;
	}

	static get styles() {
		return css`
			iframe {
				width: 100%;
				height: 100%;
				border: 0;
			}
		`;
	}

	render() {
		return this.$iframe;
	}

}
customElements.define("ros-rocketchat-frame", RocketchatFrame);
