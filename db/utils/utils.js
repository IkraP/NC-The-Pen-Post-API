exports.formatDates = list => {
  if (list.length === 0) return list;
  return list.map(item => {
    return { ...item, created_at: new Date(item.created_at * 1000) };
  });
};

exports.makeRefObj = (arrayOfObj, keyRequired, valueRequired) => {
  return arrayOfObj.reduce(
    (curr, objItem) => ({
      ...curr,
      [objItem[keyRequired]]: objItem[valueRequired]
    }),
    {}
  );
};

exports.formatComments = (comments, articleRef) => {};
// This utility function should be able to take an array of comment objects (comments) and a reference object, and return a new array of formatted comments.

// Each formatted comment must have:

// Its created_by property renamed to an author key
// Its belongs_to property renamed to an article_id key
// The value of the new article_id key must be the id corresponding to the original title value provided
// Its created_at value converted into a javascript date object
// The rest of the comment's properties must be maintained
