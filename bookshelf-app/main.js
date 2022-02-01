const COMPLETED_BOOKS_STORAGE_KEY = 'cbsk';
const INCOMPLETED_BOOKS_STORAGE_KEY = 'icbsk';
const BOOK_STORAGE_KEY_PREFIX = 'bk';

const COMPLETED_BOOK_HTML_ID_PREFIX = 'completed';
const INCOMPLETED_BOOK_HTML_ID_PREFIX = 'incompleted';

const RENDER_BOOK_EVENT = 'render_book';

const CONTEXT = {
  completedBooks: [],
  incompletedBooks: [],
  deleteBookData: {
    id: -1,
    isCompleted: false
  }
}

document.body.onload = init;

class Book {
  constructor(title, author, year, isComplete, id=null) {
    this.id = id === null ? +new Date() : id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.isComplete = isComplete;
  }

  getBookStorageKey() {
    return `${BOOK_STORAGE_KEY_PREFIX}-${this.id}`;
  }

  getBookHTMLID() {
    const prefixID = 
      this.isComplete? COMPLETED_BOOK_HTML_ID_PREFIX : INCOMPLETED_BOOK_HTML_ID_PREFIX;
    return `${prefixID}-book-${this.id}`;
  }

  createHTMLElement() {
    const textTitle = document.createElement("h3");
    textTitle.innerText = this.title;
  
    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Author: ${this.author}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Year: ${this.year}`;

    const switchButton = document.createElement("button");
    switchButton.classList.add("btn-switch", 
      this.isComplete? "complete-type" : "incomplete-type");
    switchButton.innerText = "Switch to ".concat( 
      this.isComplete? "Incompleted" : "Completed");
    switchButton.setAttribute("id", `btn-switch-${this.getBookHTMLID()}`);
    switchButton.addEventListener('click', handleSwitchStatus);

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn-remove");
    removeButton.innerText = "Remove";
    removeButton.setAttribute("id", `btn-remove-${this.getBookHTMLID()}`);
    removeButton.addEventListener('click', handleDeleteBookWithConfirm);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn-container");
    buttonContainer.append(switchButton, removeButton);

    const wrapper = document.createElement("div");
    wrapper.classList.add("book-item");
    wrapper.append(textTitle, textAuthor, textYear, buttonContainer);
    wrapper.setAttribute("id", this.getBookHTMLID());
  
    return wrapper;
  }

  static getBookStorageKey(id) {
    return `${BOOK_STORAGE_KEY_PREFIX}-${id}`;
  }

  static getBookByIDFromStorage(id) {
    const obj = JSON.parse(localStorage.getItem(Book.getBookStorageKey(id)));
    return obj === null? null : 
      new Book(obj.title, obj.author, obj.year, obj.isComplete, obj.id);
  }

  static getBooksFromStorage() {
    let completed = [];
    let incompleted = [];

    if (typeof(Storage) !== 'undefined') {
      completed = localStorage.getItem(COMPLETED_BOOKS_STORAGE_KEY);
      incompleted = localStorage.getItem(INCOMPLETED_BOOKS_STORAGE_KEY);
  
      if(completed !== null) {
        completed = JSON.parse(completed);
      } else {
        completed = [];
        localStorage.setItem(COMPLETED_BOOKS_STORAGE_KEY, JSON.stringify([]));
      }
  
      if(incompleted !== null) {
        incompleted = JSON.parse(incompleted);
      } else {
        incompleted = [];
        localStorage.setItem(COMPLETED_BOOKS_STORAGE_KEY, JSON.stringify([]));
      }
  
      completed = completed.map(Book.getBookByIDFromStorage);
      incompleted = incompleted.map(Book.getBookByIDFromStorage);
    }
    
    CONTEXT.completedBooks = completed;
    CONTEXT.incompletedBooks = incompleted;
    return { completed, incompleted };
  }

  static addBookToList(book, isComplete, addIDOnlyFlag=false) {
    const storageKey = isComplete? COMPLETED_BOOKS_STORAGE_KEY : INCOMPLETED_BOOKS_STORAGE_KEY;
    const list = isComplete? CONTEXT.completedBooks : CONTEXT.incompletedBooks;

    list.push(book);
    if (typeof(Storage) !== 'undefined') {
      const indexes = list.map(obj => obj.id);
      if(!addIDOnlyFlag)
        localStorage.setItem(book.getBookStorageKey(), JSON.stringify(book));
      localStorage.setItem(storageKey, JSON.stringify(indexes));
    }
  }

  static removeBookFromList(id, isComplete, removeFromStorageFlag=false) {
    const storageKey = isComplete? COMPLETED_BOOKS_STORAGE_KEY : INCOMPLETED_BOOKS_STORAGE_KEY;
    let list = [];
    
    if(isComplete) {
      CONTEXT.completedBooks = CONTEXT.completedBooks.filter(book => book.id !== id);
      list = CONTEXT.completedBooks;
    } else {
      CONTEXT.incompletedBooks = CONTEXT.incompletedBooks.filter(book => book.id !== id);
      list = CONTEXT.incompletedBooks;
    }

    if (typeof(Storage) !== 'undefined') {
      const indexes = list.map(obj => obj.id);

      localStorage.setItem(storageKey, JSON.stringify(indexes));
      if (removeFromStorageFlag) {
        localStorage.removeItem(Book.getBookStorageKey(id));
      }
    }
  }
}

function init() {
  registerEvents();
  loadData();
  renderBooks();
}

function loadData() {
  Book.getBooksFromStorage();
}

function registerEvents() {
  document.addEventListener(RENDER_BOOK_EVENT, renderBooks);
  document.querySelector('#btn-add').addEventListener('click', handleAddBook);
  document.querySelector('#btn-search').addEventListener('click', handleSearchBook);
  document.querySelector('#btn-reset').addEventListener('click', handleReset);
  document.querySelector('#btn-cancel-delete').addEventListener('click', handleDeclineDeleteBook);
  document.querySelector('#btn-confirm-delete').addEventListener('click', handleProceedDeleteBook);
}

function renderBooks() {
  const indexes = [
    [CONTEXT.completedBooks, document.querySelector("#completed-bookshelf-list")],
    [CONTEXT.incompletedBooks, document.querySelector("#incompleted-bookshelf-list")]
  ]

  for (idx of indexes) {
    const bookList = idx[0];
    const listElement = idx[1];

    listElement.innerHTML = "";
    for (book of bookList) {
      listElement.append(book.createHTMLElement());
    }
  }
}

function handleAddBook(event) {
  event.preventDefault();

  const titleInput = document.querySelector("#input-title");
  const authorInput = document.querySelector("#input-author");
  const yearInput = document.querySelector("#input-year");
  const isCompleteInput = document.querySelector("#input-is-complete");

  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;
  const isComplete = isCompleteInput.checked;


  if(!title || !author || !year) {
    window.alert('Title, author, and year field must be filled!');
    return;
  }

  const book = new Book(title, author, year, isComplete);

  Book.addBookToList(book, isComplete);

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteInput.checked = false;

  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}

function handleSearchBook(event) {
  const inputElement = document.querySelector('#input-search');
  const substr = inputElement.value;

  CONTEXT.completedBooks = CONTEXT.completedBooks.filter(book => book.title.includes(substr));
  CONTEXT.incompletedBooks = CONTEXT.incompletedBooks.filter(book => book.title.includes(substr));
  inputElement.value = '';

  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}

function handleReset(event) {
  Book.getBooksFromStorage();

  document.querySelector('#input-search').value = '';
  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}

function handleDeleteBook(event) {
  const idArr = event.target.id.split('-');
  const n = idArr.length;
  const id = +idArr[n - 1];
  const isCompleted = idArr[n - 3] === COMPLETED_BOOK_HTML_ID_PREFIX;

  Book.removeBookFromList(id, isCompleted, true);

  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}

function handleDeleteBookWithConfirm(event) {
  const idArr = event.target.id.split('-');
  const n = idArr.length;
  const id = +idArr[n - 1];
  const isCompleted = idArr[n - 3] === COMPLETED_BOOK_HTML_ID_PREFIX;

  document.querySelector('#delete-modal').style.display = 'block';
  CONTEXT.deleteBookData.id = id;
  CONTEXT.deleteBookData.isCompleted = isCompleted;
}

function handleProceedDeleteBook(event) {
  Book.removeBookFromList(CONTEXT.deleteBookData.id, CONTEXT.deleteBookData.isCompleted, true);

  document.querySelector('#delete-modal').style.display = 'none';
  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}

function handleDeclineDeleteBook(event) {
  document.querySelector('#delete-modal').style.display = 'none';
}

function handleSwitchStatus(event) {
  const idArr = event.target.id.split('-');
  const n = idArr.length;
  const id = +idArr[n - 1];
  const isCompleted = idArr[n - 3] === COMPLETED_BOOK_HTML_ID_PREFIX;
  const book = Book.getBookByIDFromStorage(id);
  book.isComplete = !isCompleted;

  Book.removeBookFromList(id, isCompleted, false);
  Book.addBookToList(book, !isCompleted);

  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}
