/**
 * 
 */
export class LightboxContent extends HTMLElement {
    constructor() {
        super();
        // get the photographer ID from url
        this.id = window.history.state.url.slice(5);
        // get the photographer name from the photographerID
        this.photographerName = this.getPhotographerName(this.id);
        // get the photographer medias
        this.medias = this.getMedias(this.id);
        // current media displayed
        this.currentMedia;

    }
 
    /**
     * Insert an template, then call short() & render() & listenSort
     */
    connectedCallback () {
        const template = document.createElement('template');
        template.innerHTML = ``;
        this.appendChild(template.content);
        this.sort("date");
        this.listenSort();
        this.listenPreviousMedia();
        this.listenNextMedia();
    }

    /**
     *  
     */
    render(media) {
        this.innerHTML = ""
        if(media.src) {
            this.insertAdjacentHTML('afterbegin', `<img class="self-center" 
            alt="` + media.alt +
            `" src="` + media.src.slice(0,-8) + 
            `.jpg"></img>`)
        }else {
            this.insertAdjacentHTML('afterbegin', `<video class="self-center" alt="` + media.alt + `" autoplay controls loop>
            <source src="` + (media.video || media.childNodes[0].src) +`" type="video/mp4">
            </video>`)
        }
        document.querySelector(".titleMediaLightbox").innerHTML = media.alt || media.childNodes[0].getAttribute('alt');
        this.currentMedia = media;

    }

    /**
     * Sort the medias in terms of date, likes or title
     * @param {sting} value - parameters of sorting
     */
    sort(value) {
        switch (value) {
            case "date":
                this.medias.sort((m1, m2) => {
                    let d1 = new Date(m1.date);
                    let d2 = new Date(m2.date);
                    return d2 - d1;
                })
                break;
        
            case "likes":
                this.medias.sort((m1, m2) => m2.likes - m1.likes);
                break;
        
            case "title":
                this.medias.sort((m1, m2) => m1.title.toLowerCase().localeCompare(m2.title.toLowerCase()));
                break;
        
            default:
                console.error("Oops");
                break;
        }
        this.listenOpenLightbox();
    }

    /**
     * 
     */
    listenOpenLightbox() {
        document.querySelectorAll("article img, article video").forEach(media => {
            media.addEventListener('click', () => {this.render(media)})
        })
        document.querySelectorAll("article img, article video").forEach(media => {
            media.addEventListener('keydown', event => {
                if(event.key === 'Enter') {
                    this.render(media)
                }
            })
        })
    }

    /**
     * Listen to the <medias-select> component, and sort() when a sorting parameter is selected
     */
     listenSort() {
        document.getElementById("sortMedias").addEventListener('change', select => {
            this.sort(select.target.value);
        })
    }

    /**
     * 
     */
    listenPreviousMedia() {
        document.querySelector(".previousMediaLightbox").addEventListener('click', () => {
            this.render(this.getPreviousMedia(this.currentMedia));
        })
        document.addEventListener('keydown', event => {
            if( event.key === 'ArrowLeft') {
                this.render(this.getPreviousMedia(this.currentMedia));
            }
        })
    }

    listenNextMedia() {
        document.querySelector(".nextMediaLightbox").addEventListener('click', () => {
            this.render(this.getNextMedia(this.currentMedia));
        })
        document.addEventListener('keydown', event => {
            if( event.key === 'ArrowRight') {
                this.render(this.getNextMedia(this.currentMedia));
            }
        })
    }

    /**
     * From an ID return an array with all the photographer's medias from the JSON
     * @param {integer} id - id of the photographer
     * @returns {array} - the photographer's medias
     */
    getMedias(id) {
        // return the photographer in the JSON whose ID match the requested ID
        return data.media.filter(media => media.photographerId == id);
    }

    /**
     * 
     */
    getPreviousMedia(media) {
        let mediaId = this.medias.indexOf(this.medias.find(mda => mda.id == media.id));
        let previousMediaData;
        if(mediaId>=1) {
            previousMediaData = this.medias[mediaId-1];
        }else {
            previousMediaData = this.medias[this.medias.length-1];
        }
        let previousMedia = {
            id: previousMediaData.id,
            alt: previousMediaData.title 
        }
        if(previousMediaData.image) {
            previousMedia.src = "./images/" + this.photographerName.split(' ')[0] + "/" + previousMediaData.image.slice(0, -4) + "-min.jpg";
        }else {
            previousMedia.video = "./images/" + this.photographerName.split(' ')[0] + "/" + previousMediaData.video; 
        }
        return previousMedia;
    }

    /**
     * 
     */
    getNextMedia(media) {
        let mediaId = this.medias.indexOf(this.medias.find(mda => mda.id == media.id));
        let nextMediaData;
        if(mediaId<(this.medias.length-1)) {
            nextMediaData = this.medias[mediaId+1];
        }else {
            nextMediaData = this.medias[0];
        }
        let nextMedia = {
            id: nextMediaData.id,
            alt: nextMediaData.title 
        }
        if(nextMediaData.image) {
            nextMedia.src = "./images/" + this.photographerName.split(' ')[0] + "/" + nextMediaData.image.slice(0, -4) + "-min.jpg";
        }else {
            nextMedia.video = "./images/" + this.photographerName.split(' ')[0] + "/" + nextMediaData.video; 
        }
        return nextMedia;
    }

    /**
     * Return a string with the photographer's name from the JSON
     * Require this.id to be correct
     * @returns {string} - the photographer's name
     */
    getPhotographerName(id) {
        // return the photographer in the JSON whose ID match the photographer's ID in the media's data
        return data.photographers.find(photographer => photographer.id == id).name;
    }

}

// Import data from the JSON
import data from '../../../assets/data/FishEyeDataFR.json'
