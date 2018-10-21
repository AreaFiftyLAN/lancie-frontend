const template = document.createElement('template');

class LancieActivities extends HTMLElement {
    static get observedAttributes() {
        return ['location'];
    }

    connectedCallback() {
        const clone = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(clone);

        this.fetchResources();
    }

    async fetchResources() {
        const response = await fetch(this.getAttribute('location'));

        if (response.ok) {
            const activities = await response.json();

            for (const activity of activities) {
                const div = document.createElement('div');

                const title = document.createElement('h3');
                title.innerText = activity.title;

                div.appendChild(title);

                this.shadowRoot.appendChild(div);
            }
        }
    }
}

customElements.define('lancie-activities', LancieActivities);