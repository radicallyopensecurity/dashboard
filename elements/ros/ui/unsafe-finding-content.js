import { UnsafeContent } from '../../ui/unsafe-content.js';

class UnsafeFindingContent extends UnsafeContent {

	get contentStyle() {
		return `
			img { width: 100%; }
			h2 { border-bottom: 1px solid var(--bs-gray); }
		`;
	}

	get renderedUnsafeHTML() {
		return this.unsafeHTML
			.replaceAll(/<img src="\/uploads\//gi, `<img src="${this.baseUrl}/uploads/`);
	}

}
customElements.define("ros-ui-unsafe-finding-content", UnsafeFindingContent);