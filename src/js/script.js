'use strict';

// -------- Constructor for cards --------
class Card {
    constructor(src, alt, title, date, size, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.date = date;
        this.size = size;
        this.parent = document.querySelector(parentSelector);
        this.classes = classes;
        this.changeDate();
    }

    changeDate() {
        let d = new Date(this.date);
        this.date = (d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear());
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

// ------------------------------
// -------- Get Request and  --------

const requestURL = 'http://contest.elecard.ru/frontend_data/catalog.json';

function sendRequest(method, url) {
    const request = new XMLHttpRequest();

    request.open(method, url);

    request.onload = () => {
        if (request.status < 400) {
            const data = JSON.parse(request.response);

            data.forEach(item => {
                new Card(
                    'https://picsum.photos/200/200',
                    item.category,
                    item.category,
                    item.timestamp,
                    item.size,
                    '.content .cards',
                    'cards__item',
                ).render();
            });
            console.log(data[0]);

            document.querySelectorAll('.cards__item-close').forEach((btn) => {
                btn.addEventListener('click', () => {
                    btn.parentElement.remove();
                });
            });

        } else {
            console.error(request.response);
        }
    };

    request.onerror = () => {
        console.log(request.response);
    };

    request.send();
}

sendRequest('GET', requestURL);
// ---------------------------------------

// document.querySelector('.btnReset').addEventListener('click', sendRequest);