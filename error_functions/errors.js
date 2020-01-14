const send404Error = (request, response, next) => {
  next({ status: 404, msg: "Route not found" });
};

const send405Error = (request, response, next) => {
  response.status(405).send({ msg: "method not allowed" });
};

module.exports = { send404Error, send405Error };
