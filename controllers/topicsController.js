const { selectTopics } = require("../models/topicsModel");

const sendTopics = (request, response, next) => {
  //Sending topics to router to send to client
  selectTopics().then(topics => {
    response.status(200).send({ topics });
  });
};

module.exports = { sendTopics };
