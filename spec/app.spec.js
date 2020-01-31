process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const endpoints = require("../endpoints.json");

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    // ----------------- /TOPICS --------------------
    it("GET / will respond with status 200 when client requests topics array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
    it("GET / will respond with status 200 and a topics array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics.length).to.equal(3);
          expect(topics[0]).to.have.keys(["slug", "description"]);
        });
    });
    // ----------------- /TOPICS Error handling --------------------
    it("GET / will respond with 404 Invalid request when the url is invalid", () => {
      return request(app)
        .get("/api/not-a-valid-url")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Route not found");
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
  // ----------------- /USERS --------------------
  describe("/users", () => {
    describe("/:username", () => {
      it("GET / with a status code 200 after successful response", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200);
      });
      it("GET / will respond with a status 200 and a user array", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an("object");
            expect(user).to.have.keys(["username", "avatar_url", "name"]);
            expect(user.name).to.equal("sam");
          });
      });
      // ----------------- /USERS Error handling --------------------
      it("GET / will respond with status 404 with invalid username when invalid user is requested", () => {
        return request(app)
          .get("/api/users/sadiyahKal")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid username");
          });
      });
      it("GET / will respond with status 405 method not allowed when method requested is not valid", () => {
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
  // -----------------  /Articles/:Article_id  --------------------
  describe("/articles", () => {
    describe("/:article_id", () => {
      it("GET / will respond with a status code of 200 when client requests an article by article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200);
      });
      it("GET / will respond with status 200 with an article object with required keys", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article).to.have.keys([
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(article.author).to.equal("butter_bridge");
          });
      });
      // -----------------  /Articles/:Article_id Error handling --------------------
      it("GET / will respond with a 404 when an article doesn't exist", () => {
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
      it("PATCH / will respond with status 200 with the updated article with votes updated", () => {
        return request(app)
          .patch("/api/articles/2")
          .expect(200)
          .send({ inc_votes: 20 })
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.votes).to.equal(20);
            expect(article).to.contain.keys(["article_id", "body", "votes"]);
          });
      });
      it("PATCH / will respond with status 400 when request body has characters that do not match the required value of inc_votes", () => {
        return request(app)
          .patch("/api/articles/4")
          .expect(400)
          .send({ inc_votes: "ikra" })
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH / will respond with status 400 when request body contain a spelling mistake but the correct value is given for inc_votes", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ incvotes: 67 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request: Missing required field");
          });
      });
      it("PATCH / will respond with status 200 with an updated votes value when other key value pairs are also in the body", () => {
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
      it("PATCH / will respond with a 405 method not allowed when method requested is not valid", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      // -----------------  /Articles/:article_id/comments --------------------
      it("POST / will respond with status 201 to signal a successful post of comments has completed", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "rogersop",
            body: "This article really speaks to me!"
          })
          .expect(201);
      });
      it("POST / will respond with status 201 with a comment object with required keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(201)
          .send({
            username: "rogersop",
            body: "This article really speaks to me!"
          })
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment).to.contain.keys(["body", "author", "article_id"]);
          });
      });
      // -----------------  /Articles/:article_id/comments --------------------
      it("POST / will respond with status 400 and returns no comment given when no body is given by the client specifying no comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request: No comment given");
          });
      });
      it("POST / will respond with status 400 when the body object given by client doesn't contain the correct keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            myfriend: "rogersop",
            body: "This article really speaks to me!"
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request: No comment given");
          });
      });
      it("POST / will respond with status 405 method not allowed when the article_id is not specified", () => {
        return request(app)
          .patch("/api/articles/")
          .send({
            username: "rogersop",
            body: "I really liked this article - well done :)"
          })
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      it("POST / will respond with status 404 Not found when the article is a valid ID but doesn't exist in our database ", () => {
        return request(app)
          .post("/api/articles/456/comments")
          .send({
            username: "rogersop",
            body: "I really like the way you write!"
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Not Found");
          });
      });
      it("GET / will respond with status 200 when array of comments is returned to client for a given article_id", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200);
      });
      it("GET / will respond with status 200 with an array of comments with the required keys", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments[0]).to.have.keys([
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            ]);
          });
      });
      it("GET / will respond with status 404 when article specified by client doesn't exist in the database", () => {
        return request(app)
          .get("/api/articles/789097/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).equal("Article doesn't exist");
          });
      });
      it("GET / will respond with status 400 bad request when no article_id is specified", () => {
        return request(app)
          .get("/api/articles/notanid/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).equal("Bad request");
          });
      });
      it("GET / will respond with status 200 and the sorted array default sorted by created_at", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET / will respond with status 200 with sorted array when votes column is specified in the query", () => {
        return request(app)
          .get("/api/articles/5/comments?sort_by=votes")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("votes", { descending: true });
          });
      });
      it("GET / will respond with status 200 with sorted array when the author column is specified in the query", () => {
        return request(app)
          .get("/api/articles/5/comments?sort_by=author")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("author", { descending: true });
          });
      });
      it("GET / will respond with status 200 with the default sort by column which is created_at when the client given query column doesn't exist", () => {
        return request(app)
          .get("/api/articles/5/comments?sort_by=ikra")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET / will respond with status 200 with the comments ordered in descending order when no order is specified by the client", () => {
        return request(app)
          .get("/api/articles/5/comments?sort_by=created_at")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET / will respond with status 200 with the comments ordering in ascending when order is specified by the client", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("comment_id", { ascending: true });
          });
      });
      it("GET / will respond with status 200 with order as default descending when order specified is not asc or desc", () => {
        return request(app)
          .get("/api/articles/5/comments?sort_by=votes&order=kjasbfjkabf")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy("votes", { descending: true });
          });
      });
    });
    it("GET / will respond with status 405 method not allowed when method requested is not valid", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    describe("/", () => {
      it("GET / will respond with status 200 when the client requests all the articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200);
      });
      it("GET / will respond with status 200 with an articles array of article objects with required keys", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
      });
      it("GET / will have a total_count key on the articles array to specify number of articles", () => {
        return request(app)
          .get("/api/articles")
          .then(articles => {
            expect(articles.body.total_count).to.be.an("Number");
          });
      });
      it("GET / will respond with status 404 Invalid request when the url is invalid", () => {
        return request(app)
          .get("/api/articles/not-a-valid-url")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("GET / will respond with status 405 method not allowed when method requested is not valid", () => {
        const invalidMethods = ["patch", "put", "delete", "post"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });

      it("GET / will respond with status 200 and accept sort_by queries by valid columns in the articles object", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("author", { descending: true });
          });
      });
      it("GET / will respond with status 200 and will sort the articles based on date (created_at) when no sort_by parameter is specified by client", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET / will respond with status 200 with the articles array when sort_by column is not a column", () => {
        return request(app)
          .get("/api/articles?sort_by=sdnasnd")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
          });
      });
      it("GET / will respond with status 200 and sort the order of articles when the client specifies the order as desc or asc", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("GET / will respond with status 200 and the articles array in default sorting values when order specified is not asc or desc", () => {
        return request(app)
          .get("/api/articles?order=asdasf")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
          });
      });
      it("GET / will respond with status 200 and default the order query to desc when order is not specified by client", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET / will respond with status 200 and will filter articles based on author specified by client", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].author).to.equal("butter_bridge");
            expect(articles[articles.length - 1].author).to.equal(
              "butter_bridge"
            );
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET / will respond with status 404 and Invalid Input when author doesn't exist", () => {
        return request(app)
          .get("/api/articles?author=sadiyah")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid Input - resource doesn't exist");
          });
      });
      it("GET / will respond with status 200 and an empty array when author is valid but written no articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles.length).to.equal(0);
          });
      });
      it("GET / will respond with status 200 and articles by a certain topic when client specifies the topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].topic).to.equal("mitch");
            expect(articles[articles.length - 1].topic).to.equal("mitch");
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET / will respond with status 404 error when topic doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=asdasdf")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid Input - resource doesn't exist");
          });
      });
    });
  });
  describe("/comments", () => {
    describe("/comment_id", () => {
      it("PATCH / will respond with a status 200 when comment is updated with inc votes", () => {
        return request(app)
          .patch("/api/comments/10")
          .send({ inc_votes: 10 })
          .expect(200);
      });
      it("PATCH / will respond with a status code 200 when comment is updated with inc_votes is a positive integer", () => {
        return request(app)
          .patch("/api/comments/10")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment).to.have.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
            expect(comment.votes).to.equal(10);
          });
      });
      it("PATCH / will respond with a status 201 when comment is updated with inc_votes is a negative integer", () => {
        return request(app)
          .patch("/api/comments/10")
          .expect(200)
          .send({ inc_votes: -10 })
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment).to.have.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
            expect(comment.votes).to.equal(-10);
          });
      });
      it("PATCH / will respond with status 200 and the comment object without +/- in votes when the no inc_votes is specified by the client", () => {
        return request(app)
          .patch("/api/comments/10")
          .expect(200)
          .send({})
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment).to.have.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
            expect(comment.votes).to.equal(0);
          });
      });
      it("PATCH / will respond with status 200 and the comment object without +/- in votes when inc_votes is incorrectly spelt by client", () => {
        return request(app)
          .patch("/api/comments/10")
          .expect(200)
          .send({ incvotes: 2 })
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment).to.have.keys([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
            expect(comment.votes).to.equal(0);
          });
      });
      it("PATCH / will respond with status 404 error when the comment doesn't exist to +/- votes", () => {
        return request(app)
          .patch("/api/comments/189759")
          .send({ inc_votes: 90 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Comment does not exist");
          });
      });
      it("PATCH / will respond with status 400 and invalid column type bad request when client gives comment that doesn't exist", () => {
        return request(app)
          .patch("/api/comments/not-a-valid-id")
          .send({ inc_votes: 90 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH / will respond with status 400 when inc votes is not an integer by client", () => {
        return request(app)
          .patch("/api/comments/10")
          .send({ inc_votes: "ikra" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("DELETE / will respond with status 204 and no content and delete the comment by comment id specified by client", () => {
        return request(app)
          .delete("/api/comments/10")
          .expect(204);
      });
      it("DELETE/ will respond with status 404 when the comment id specified by client doesn't exist", () => {
        return request(app)
          .delete("/api/comments/827321")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Comment does not exist");
          });
      });
      it("DELETE / will respond with status 400 when invalid id given by client ", () => {
        return request(app)
          .delete("/api/comments/not-a-valid-id")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("/ will respond with status 405 method not allowed when method requested is not valid", () => {
        const invalidMethods = ["get", "put", "post"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });

  describe("/", () => {
    it("GET / will respond with a JSON describing all of the available endpoints and possible queries by the client", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(response => {
          expect(response.body).to.eql(endpoints);
        });
    });
  });
});
