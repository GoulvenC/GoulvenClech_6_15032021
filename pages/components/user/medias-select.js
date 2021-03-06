/**
 * A custom <select> component for sorting photographer's media
 */
export class MediasSelect extends HTMLElement {
    constructor() {
        super();
    }
 
    /**
     * Insert a <select> template
     * SEE main.css FOR THE STYLE
     */
    connectedCallback () {
        const template = document.createElement('template');
        template.innerHTML = `
        <label for="sortMedias"> Trier par </label>
        <select id="sortMedias" class"hidden">
            <option value="date">Date</option>
            <option value="likes">Popularit√©</option>
            <option value="title">Titre</option>
        </select>
        `;
        this.appendChild(template.content);
        this.render();
    }

    /**
     * 
     */
    render() {
        
    }


}