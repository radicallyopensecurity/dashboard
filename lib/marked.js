import marked from '../web_modules/marked.js';

// tweak marked renderer
const headingLevelOffset = 2;
marked.use({
	renderer: {
		heading(text, level) {
			level += headingLevelOffset;
			return `<h${level}>${text}</h${level}>`;
		},
		code(code, infostring, escaped) {
			const lang = (infostring || '').match(/\S*/)[0];
			if (this.options.highlight) {
				const out = this.options.highlight(code, lang);
				if (out != null && out !== code) {
					escaped = true;
					code = out;
				}
			}

			code = code.replace(/\n$/, '') + '\n';

			const $pre = document.createElement("pre");
			const $code = document.createElement("code");
			$pre.appendChild($code);
			$pre.classList.add("bg-light", "p-3");

			if (escaped) {
				$code.innerHTML = code;
			} else {
				$code.innerText = code;
			}

			if (lang) {
				$code.classList.add(`${this.options.langPrefix}${escape(lang, true)}`);
			}

			return $pre.outerHTML;
		}
	}
});

export default marked;