/**
 * Tuner Component
 * @public
 */
export class TunerComponent {

    public render(element: HTMLElement) {
        const p = element.ownerDocument.createElement('p');
        p.textContent = 'Tuner';
        element.appendChild(p);
    }

}

