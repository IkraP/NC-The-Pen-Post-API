const sendApiEndpoints = (request, response, next) => {
  const options = {
    root: "./"
  };
  response.sendFile("endpoints.json", options, err => {
    next(err);
  });
};

module.exports = sendApiEndpoints;
