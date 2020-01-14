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
    it.only("GET / will respond with a 405 method not allowed when method requested is not valid", () => {
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
          .get("/api/users/1")
          .expect(200);
      });
      it("GET / will respond with a user array", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .then(users_response => {
            expect(user_response.body.users).to.be.an("object");
            expect(user_response.body.users).to.have.keys([
              "username",
              "avatar_url",
              "name"
            ]);
          });
      });
    });
  });
});

//  username: 'icellusedkars',
//     name: 'sam',
//     avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
// invalid methods 405
