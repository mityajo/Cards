'use strict';

const requestURL = 'http://contest.elecard.ru/frontend_data/catalog.json',
    radioDate = document.querySelector('[value="date"]'),
    radioСategory = document.querySelector('[value="category"]'),
    radioSize = document.querySelector('[value="size"]'),
    sortForm = document.querySelector('.footer__form');

let dataAray;

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
        this.getDate();
    }

    getDate() {
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
        <div class="cards__item__img">
            <img src=${this.src} alt=${this.alt}>
        </div>
        <div class="cards__item__discr">
            <div class="cards__item__title">${this.title}</div>
            <div class="cards__item__date">${this.date}</div>
        </div>
        <div class="cards__item-close">&#10006;</div>
        `;
        this.parent.append(element);
    }
}


// -------- Get Request --------
function sendRequest(method, url) {
    const request = new XMLHttpRequest();

    request.open(method, url);

    request.onload = () => {
        if (request.status < 400) {
            const data = JSON.parse(request.response);
            dataAray = Array.from(data);
            createPage(dataAray);
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


// -------- Add Preloader --------
function showPreloader() {
    const images = document.querySelectorAll('img'),
        imagesTotalCount = images.length,
        preloader = document.getElementById('page-preloader'),
        percDisplay = document.querySelector('.preloader__perc');
    let imagesLoadedCount = 0;

    for (let i = 0; i < imagesTotalCount; i++) {
        let imageClone = new Image();

        imageClone.onload = imageLoaded;
        imageClone.onerror = imageLoaded;
        imageClone.src = images[i].src;
    }

    function imageLoaded() {
        imagesLoadedCount++;
        percDisplay.innerHTML = (((100 / imagesTotalCount) * imagesLoadedCount) << 0) + '%';

        if (imagesLoadedCount >= imagesTotalCount) {
            setTimeout(() => {
                if (!preloader.classList.contains('done')) {
                    preloader.classList.add('done');
                }
            }, 1000);
        }
    }
}


// -------- Sort --------
sortForm.addEventListener('click', () => {
    if (radioDate.checked) {
        dataAray.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
        createPage(dataAray);
    } else if (radioSize.checked) {
        dataAray.sort((a, b) => a.filesize > b.filesize ? 1 : -1);
        createPage(dataAray);
    } else {
        dataAray.sort((a, b) => a.category > b.category ? 1 : -1);
        createPage(dataAray);
    }
});


// -------- Create Page --------
function createPage(dataAray) {
    document.querySelector('.cards').innerHTML = "";

    dataAray.forEach(item => {
        new Card(
            'http://contest.elecard.ru/frontend_data/' + item.image,
            item.category,
            item.category,
            item.timestamp,
            item.size,
            '.content .cards',
            'cards__item',
        ).render();
    });
    removeCard();
    showPreloader();
}


// -------- Remove Card --------
function removeCard() {
    document.querySelectorAll('.cards__item-close').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            btn.parentElement.remove();
            dataAray.splice(i, 1);
            createPage(dataAray);
            console.log(dataAray);
        });
    });
}
