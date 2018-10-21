import {render} from '../../node_modules/lit-html/lit-html.js';

class LancieTickets extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});

        const { template } = await import('./lancie-tickets-template.js');
        render(template, shadow);
    }
}

customElements.define('lancie-tickets', LancieTickets);