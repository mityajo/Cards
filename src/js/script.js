'use strict';

// -------- Create cards --------
class Card {
    constructor(src, alt, title, date, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.date = date;
        this.parent = document.querySelector(parentSelector);
        this.classes = classes;
    }

    render() {
        const element = document.createElement('div');

        if (this.classes.length === 0) {
            this.element = 'cards__item';
            element.classList.add(this.element);
        } else {
            this.classes.forEach(className => element.classList.add(className));
        }

        element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <div class="cards__item__title">${this.title}</div>
        <div class="cards__item__date">${this.date}</div>
        <div class="cards__item-close">&#10006;</div>
        `;
        this.parent.append(element);
    }
}

new Card(
    'img/4.jpg',
    'new pic',
    'New Picture',
    '14.12.2021',
    '.content .cards',
    // 'cards__item',
).render();

// ------------------------------
// -------- Get Request --------

const requestURL = 'http://contest.elecard.ru/frontend_data/catalog.json';
const request = new XMLHttpRequest();

request.open('GET', requestURL);

request.onload = () => {
    if (request.status < 400) {
        const data = JSON.parse(request.response);
        console.log(data[0].category);
    } else {
        console.error(request.response);
    }
};

request.onerror = () => {
    console.log(request.response);
};

request.send();