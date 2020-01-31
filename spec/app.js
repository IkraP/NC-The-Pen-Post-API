

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
