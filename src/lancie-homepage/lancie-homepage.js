import {render} from '../../node_modules/lit-html/lit-html.js';

class LancieHomepage extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});

        const { template } = await import('./lancie-homepage-template.js');
        render(template, shadow);
    }
}

customElements.define('lancie-homepage', LancieHomepage);