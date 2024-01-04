/* eslint-disable indent */

const select = {
    filters: '.filters',
    ratings: '.book__rating__fill',

    templateOf: {
        book: '#template-book',
    },

    atributes: {
        dataId: 'data-id',
    },

    listOf: {
        books: '.books-list',
        images: 'book__image',
    },

    classNames: {
        favorite: 'favorite',
        hidden: 'hidden',
    },
};

const templates = {
    booksList: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
};

const favouriteBooks = [];
const filters = [];

class BooksList {

    constructor() {
        this.initData();
        this.getElements();
        this.render(this.data);
        this.initActions();
    }

  
    initData() {
        this.data = dataSource.books;
    }


    getElements() {
        this.dom = {
            booksList: document.querySelector(select.listOf.books),
            filtersList: document.querySelector(select.filters),
        };
    }


    render(books) {
        for (let book of books) {
            const HTMLelement = templates.booksList(book);
            const DOMelement = utils.createDOMFromHTML(HTMLelement);
            const ratingBar = DOMelement.querySelector(select.ratings);
            const ratingBgc = this.determineRatingBgc(book.rating);
            const ratingWidth = this.determineRatingWidth(book.rating);
            this.dom.booksList.appendChild(DOMelement);
            ratingBar.style.background = ratingBgc;
            ratingBar.style.width = ratingWidth;
        }
    }
  
  
    initActions() {
        this.dom.booksList.addEventListener('dblclick', function(event){
            event.preventDefault();
            const clickedBook = event.target.offsetParent;
            if (clickedBook.classList.contains(select.listOf.images)) {
                const favId = clickedBook.getAttribute(select.atributes.dataId);
                if (favouriteBooks.includes(favId)) {
                    clickedBook.classList.remove(select.classNames.favorite);
                    favouriteBooks.pop(favId);
                } else {
                    clickedBook.classList.add(select.classNames.favorite);
                    favouriteBooks.push(favId);
                }
            }
        });

        this.dom.filtersList.addEventListener('click', function(event) {  
            if (event.target.tagName == 'INPUT' && event.target.name == 'filter' && event.target.type == 'checkbox') {  
                if (event.target.checked) {
                    filters.push(event.target.value);
                } else {
                    filters.splice(filters.indexOf(event.target.value), 1);
                }
            }
            app.filterBooks();
        });
    }
  
  
    filterBooks() {
        for (let book of dataSource.books) {
            let shouldBeHidden = false;
            for (let filter of filters) {
                if (!book.details[filter]) {
                    shouldBeHidden = true;
                }
            }
            const bookHide = document.querySelector('.' + select.listOf.images + '[' + select.atributes.dataId + '="' + book.id + '"]'); 
            if (shouldBeHidden) {
                bookHide.classList.add(select.classNames.hidden); 
            } else {
                bookHide.classList.remove(select.classNames.hidden); 
            }
        }
    }


    determineRatingBgc(rating) {
        if (rating < 6) {
            return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
        } else if (rating < 8) {
            return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
        } else if (rating < 9) {
            return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
        } else {
            return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
        }
    }
  
  
  determineRatingWidth(rating) {
        return (rating * 10 + '%');
    }
}

const app = new BooksList();