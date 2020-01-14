exports.formatDates = list => {
  if (list.length === 0) return list;
  return list.map(item => {
    return { ...item, created_at: new Date(item.created_at) };
  });
};

exports.makeRefObj = arrayOfObj => {
  return arrayOfObj.reduce(
    (curr, objItem) => ({
      ...curr,
      [objItem.title]: objItem.article_id
    }),
    {}
  );
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    let newObj = { ...comment };
    newObj.author = comment.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(comment.created_at);

    return newObj;
  });
};
