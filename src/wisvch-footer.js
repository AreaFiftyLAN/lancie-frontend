const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
        }
        li {
            list-style: none;
        }
    </style>
    <p>
        W.I.S.V. ‘Christiaan Huygens’ (CH) is the study association for students of Applied Mathematics and
        Computer Science at the Delft University of Technology.
    </p>
    <ul>
        <li><span>Address:</span> Mekelweg 4, 2628CD Delft</li>
        <li><span>Chamber of Commerce:</span> 40397077</li>
        <li><span>Phone:</span> 015-278 2532</li>
    </ul>
    <p>
        Copyright © 2015-<span id="year"></span> by W.I.S.V. ‘Christiaan Huygens’. All rights reserved.
    </p>
`;

class WisvchFooter extends HTMLElement {
    connectedCallback() {
        const clone = template.content.cloneNode(true);
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(clone);
        
        shadow.getElementById('year').textContent = new Date().getFullYear();
    }
}

customElements.define('wisvch-footer', WisvchFooter);