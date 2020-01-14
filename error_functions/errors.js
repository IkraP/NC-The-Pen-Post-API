const send404Error = (err, request, response, next) => {
  next({ status: 404, msg: "Route not found" });
};

module.exports = { send404Error };
