process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET / will give a status code of 200 after successful response", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
    it("GET / will respond a topics array", () => {
      return request(app)
        .get("/api/topics")
        .then(topics_response => {
          expect(topics_response.body.topics).to.be.an("array");
          expect(topics_response.body.topics[0]).to.have.keys([
            "slug",
            "description"
          ]);
        });
    });
    it("GET / will respond with 404 Invalid request when the url is invalid", () => {
      return request(app)
        .get("/api/not-a-valid-url")
        .expect(404)
        .then(topics_response => {
          expect(topics_response.body.msg).to.equal("Route not found");
        });
    });
    it("GET / will respond with a 405 method not allowed when method requested is not valid", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      it.only("GET / with a status code 200 after successful response", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200);
      });
      it.only("GET / will respond with a user object", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .then(user => {
            expect(user).to.be.an("object");
            expect(user).to.have.keys(["username", "avatar_url", "name"]);
            expect(user.name).to.equal("sam");
          });
      });
      it("GET / will respond with invalid username when invalid user is requested", () => {
        return request(app)
          .get("/api/users/sadiyahKal")
          .expect(404)
          .then(user_response => {
            expect(user_response.body.msg).to.equal("Invalid username");
          });
      });
      it("GET / will respond with a 405 method not allowed when method requested is not valid", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users/icellusedkars")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("GET / will respond with a status code of 200", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200);
      });
      it("GET / will respond with an article object with required keys", () => {
        return request(app)
          .get("/api/articles/1")
          .then(article_response => {
            expect(article_response.body.article).to.be.an("object");
            expect(article_response.body.article).to.have.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(article_response.body.article.author).to.equal(
              "butter_bridge"
            );
          });
      });
    });
  });
});
