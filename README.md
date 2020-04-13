# The Pen Post - API server

The Pen Post is a project created for the back-end block of the Northcoders bootcamp and is a web application that is designed to host news articles. This relational database stores articles, comments, topics and users. This project is a Node.js Express application using a RESTful API server to curate data from a postgreSQL database.

## Links to project:

Back-end is hosted on Heroku

- https://ikra-news-api.herokuapp.com

Front-end was created using React.js and is hosted on Heroku

- https://the-pen-post.herokuapp.com/home

Github repo for front-end: https://github.com/IkraP/NC-The-Pen-Post

## Getting started

### Prerequisites:

- **Node** (download [here](https://nodejs.org/en/))
- **Git** (download [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- **PostgreSQL** (download [here](https://www.postgresql.org/download/))
- **API Testing tool** (Insomnia, Postman etc)

### Installation:

1. Clone this repository

```bash
git clone https://github.com/IkraP/NC-news-api.git
```

2. `cd` into the repository

```bash
cd NC-news-api
```

3. Install all dependencies

```bash
npm install
```

4. Create a knexfile.js file in the root directory with the following code:

```js
const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
  development: {
    connection: {
      database: "nc_news",
      // if you are using a Linux, enter your username and password here
      // username: 'yourUsername'
      // password: 'yourPassword'
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      // if you are using a Linux, enter your username and password here
      // username: 'yourUsername'
      // password: 'yourPassword'
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

4. Database will require seeding - please follow these steps:

```bash
npm run setup-dbs
npm run seed
```

## Routes:

```http
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

## Test Suite:

**The-Pen-Post-API** has a suite of tests that have been used to check the functionality of endpoints of the server, error handling and any utility functions that were used to seed the data. The scripts are already present in this repository. Please follow the command below to run tests:

```bash
npm test
```

## Built with:

- [Express](https://expressjs.com/) - Node.js web application framework
- [Knex](http://knexjs.org/) - SQL query builder
- [PostgreSQL](https://www.postgresql.org/) - open source database

## Author

- **Ikra Pervaiz** - [Github](https://github.com/ikraP)
