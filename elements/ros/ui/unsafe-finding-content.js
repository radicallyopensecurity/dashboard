import { UnsafeContent } from '../../ui/unsafe-content.js';

class UnsafeFindingContent extends UnsafeContent {

	get contentStyle() {
		return `
			<link rel="stylesheet" href="./elements/ros/ui/unsafe-finding-content.css"/>
		`;
	}

	get renderedUnsafeHTML() {
		return this.unsafeHTML
			.replaceAll(/<img src="\/uploads\//gi, `<img src="${this.baseUrl}/uploads/`);
	}

}
customElements.define("ros-ui-unsafe-finding-content", UnsafeFindingContent);