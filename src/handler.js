const {nanoid} = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newBook);
    const isSuccess = books.filter((bookData) => bookData.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal Di tambahkan',
    });
    response.code(400);
    return response;
  };
};


const getAllBooks = (request, h) => {
  const {name, reading, finished} = request.query;
  if (name !== undefined) {
    const booksName = books.filter((allBooks) =>
      allBooks.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: booksName.map((allBooks) => ({
          id: allBooks.id,
          name: allBooks.name,
          publisher: allBooks.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (reading !== undefined) {
    const booksReading = books.filter((allBooks) =>
      Number(allBooks.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: booksReading.map((allBooks) => ({
          id: allBooks.id,
          name: allBooks.name,
          publisher: allBooks.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (finished !== undefined) {
    const bookFinished = books.filter((allBooks) =>
      (allBooks.finished) == (finished));
    const response = h.response({
      status: 'success',
      data: {
        books: bookFinished.map((allBooks) => ({
          id: allBooks.id,
          name: allBooks.name,
          publisher: allBooks.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((allBooks) => ({
          id: allBooks.id,
          name: allBooks.name,
          publisher: allBooks.publisher,
        })),
      },

    });
    response.code(200);
    return response;
  }
};

const detailBook = (request, h) => {
  const {id} = request.params;
  const book = books.filter((bookItem) => bookItem.id === id)[0];
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    },
    );
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBook = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((currentBook) => currentBook.id === id);
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
      'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};


const deleteBook = (request, h) => {
  const {id} = request.params;
  const isFind = books.findIndex((targetBook) => targetBook.id === id);
  if (isFind !== -1) {
    books.splice(isFind, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {addBook, getAllBooks, editBook, detailBook, deleteBook};
