CREATE TABLE lms.books (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  short_description VARCHAR(255),
  genre VARCHAR(255),
  status ENUM('available', 'borrowed') NOT NULL DEFAULT 'available',
  PRIMARY KEY (id)
);

CREATE TABLE lms.borrow (
  id INT NOT NULL AUTO_INCREMENT,
  borrower_name VARCHAR(255) NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  return_date DATE,
  PRIMARY KEY (id),
  FOREIGN KEY (book_id) REFERENCES lms.books (id) ON DELETE CASCADE
);

