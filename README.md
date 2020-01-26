# Northcoders - News RESTful API server Project

NC News is a project created for the back-end block of the Northcoders bootcamp and is a web application that is designed to host news articles. This relational database stores articles, comments, topics and users.

## Getting started

### Prerequisites:

- **node** (download [here](https://nodejs.org/en/))
- **git** (download [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- **PostgreSQL** (download [here](https://www.postgresql.org/download/))
- **API Testing tool** (Insomnia, Postman etc)

### Installation:

1. Clone this repository

```bash
git clone https://github.com/timothydowd/BE-NC-News.git
```

2. `cd` into the repository

```bash
cd NC-news-api
```

3. Install all dependencies

```bash
npm install
```

4. Database will require seeding please follow these steps

```bash
npm run setup-dbs
npm run seed
```

## Test Suite:

**NC-news-api** has a suite of tests that have been used to check the functionality of endpoints of the server, error handling and any utility functions that were used to seed the data. The scripts are already present in this repository. Please follow the command below to run tests:

```bash
npm test
```

## Built with:

- [Express](https://expressjs.com/) - Node.js web application framework
- [Knex](http://knexjs.org/) - SQL query builder
- [PostgreSQL](https://www.postgresql.org/) - open source database

## Author

- **Ikra Pervaiz** - [Github](https://github.com/ikraP)
