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
      it("GET / with a status code 200 after successful response", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200);
      });
      it("GET / will respond with a user object", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .then(({ body: { user } }) => {
            expect(user).to.be.an("object");
            expect(user).to.have.keys(["username", "avatar_url", "name"]);
            expect(user.name).to.equal("sam");
          });
      });
      it("GET / will respond with invalid username when invalid user is requested", () => {
        return request(app)
          .get("/api/users/sadiyahKal")
          .expect(404)
          .then(({ body: { msg } }) => {
            console.log(msg);
            expect(msg).to.equal("Invalid username");
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
    describe.only("/:article_id", () => {
      it("GET / will respond with a status code of 200", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200);
      });
      it("GET / will respond with an article object with required keys", () => {
        return request(app)
          .get("/api/articles/1")
          .then(({ body: { article } }) => {
            expect(article).to.be.an("array");
            expect(article[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(article[0].author).to.equal("butter_bridge");
          });
      });
      it("GET / will respond with a 404 not found when an article doesn't exist", () => {
        return request(app)
          .get("/api/articles/999999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Article doesn't exist");
          });
      });
      it("GET / will respond with a 400 Bad request when no article_id is specified", () => {
        return request(app)
          .get("/api/articles/notanid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH / will respond with a 200 when article has been updated with votes", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: 10 })
          .expect(200);
      });
      it("PATCH / will respond with with the updated article with votes updated", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: 10 })
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.votes).to.equal(10);
            expect(article).to.contain.keys(["article_id", "body", "votes"]);
          });
      });
      it("PATCH / will respond with a 400 when request body does not contain inc_vote specifically and characters that do not match the required value", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: "ikra" })
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH / will respond with a 400 when request body contain a spelling mistake but the correct key value pair of a number specified", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ incvotes: 67 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Missing required field");
          });
      });
      it("PATCH / will respond with an updated votes value when other key value pairs are also in the body", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: 7, name: "Ikra" })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.votes).to.equal(7);
            expect(article).to.contain.keys(["article_id", "body", "votes"]);
          });
      });
      it("POST / will respond with ");
    });
  });
});
