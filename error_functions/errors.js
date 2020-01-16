const send404Error = (request, response, next) => {
  next({ status: 404, msg: "Route not found" });
};

const send405Error = (request, response, next) => {
  response.status(405).send({ msg: "method not allowed" });
};

const sendCustomError = (err, request, response, next) => {
  // console.log(err, "error handling");
  if (err.status) response.status(err.status).send({ msg: err.msg });
  else next(err);
};

const sendPSQLError = (err, request, response, next) => {
  const psqlCodes = { "22P02": "Bad request", "42703": "Column doesn't exist" };
  if (psqlCodes[err.code])
    response.status(400).send({ msg: psqlCodes[err.code] });
  next(err);
};

const send500Error = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
  send404Error,
  send405Error,
  sendCustomError,
  sendPSQLError,
  send500Error
};
