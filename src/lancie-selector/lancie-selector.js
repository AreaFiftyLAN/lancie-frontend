const template = document.createElement('template');
template.innerHTML = `
<style>
    ::slotted(:not(.selected)) {
        display: none !important;
    }
</style>
<slot></slot>
`

class LancieSelector extends HTMLElement {
    static get observedAttributes() {
        return ['selected'];
    }

    connectedCallback() {
        const clone = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(clone);
    }

    attributeChangedCallback(_attribute, oldValue, newValue) {
        const oldElement = this.querySelector(`[data-page="${oldValue}"]`);

        if (oldElement) {
            oldElement.classList.remove('selected');
        }

        const newElement = this.querySelector(`[data-page="${newValue}"]`);

        if (newElement) {
            newElement.classList.add('selected');
        }
    }
}

customElements.define('lancie-selector', LancieSelector);