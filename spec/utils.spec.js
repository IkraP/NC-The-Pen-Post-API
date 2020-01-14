const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("return an empty array when passed an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("returns a formatted date when input array has one created_at timestamp value with no other key value pairs", () => {
    // A timestamp value
    const input = [{ created_at: 1468087638932 }];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.an.instanceof(Date);
  });
  it("returns a formatted date when the input array has multiple created_at timestamp values with no other keyvalue pairs", () => {
    const input = [
      { created_at: 1468087638932 },
      { created_at: 1478813209256 }
    ];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.an.instanceof(Date);
  });
  it("returns a formatted date when the input array has multiple created_at timestamps key value pairs", () => {
    const input = [
      { created_at: 1468087638932, name: "Ikra" },
      { created_at: 1478813209256, name: "Sadiyah" }
    ];
    const output = formatDates(input);
    expect(output[1].created_at).to.be.an.instanceof(Date);
  });
  it("does not mutate the input array", () => {
    const input = [
      { created_at: 1468087638932, name: "Ikra" },
      { created_at: 1478813209256, name: "Sadiyah" }
    ];
    const input2 = [
      { created_at: 1468087638932, name: "Ikra" },
      { created_at: 1478813209256, name: "Sadiyah" }
    ];
    formatDates(input);
    expect(input).to.eql(input2);
  });
});

describe("makeRefObj", () => {
  it("return an empty object when input array is empty", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns an object with key value pair of reference required when input array has one object", () => {
    const input = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(input)).to.eql({ A: 1 });
  });
  it("returns an object with key value pair of reference required when input array has multiple objects and other key value pairs", () => {
    const input = [
      { article_id: 1, title: "A", name: "ikra" },
      { article_id: 2, title: "ABC", name: "ikra" },
      { article_id: 3, title: "ABCD", name: "ikra" }
    ];
    expect(makeRefObj(input)).to.eql({
      A: 1,
      ABC: 2,
      ABCD: 3
    });
  });
  it("does not mutate the input array", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "ABC" },
      { article_id: 3, title: "ABCD" }
    ];
    const input2 = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "ABC" },
      { article_id: 3, title: "ABCD" }
    ];
    makeRefObj(input);
    expect(input).to.eql(input2);
  });
});

describe("formatComments", () => {
  it("returns an empty array when input array is empty", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("returns object with all conditions met for input array with one object", () => {
    const refObject = { "Js the easy way": 1 };
    const commentArray = [
      {
        body: "You will love Js after reading this book",
        belongs_to: "Js the easy way",
        created_by: "Ikra P",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    expect(formatComments(commentArray, refObject)).to.eql([
      {
        body: "You will love Js after reading this book",
        article_id: 1,
        author: "Ikra P",
        votes: 7,
        created_at: new Date(1478813209256)
      }
    ]);
  });
  it("returns object with all conditions met for input array with multiple objects", () => {
    const refObject = { "Js the easy way": 1, "Nobis consequatur animi": 2 };

    const comments = [
      {
        body: "this is a good book",
        belongs_to: "Js the easy way",
        created_by: "Ikra P",
        votes: 0,
        created_at: 1468087638932
      },
      {
        body: "Not a good book",
        belongs_to: "Nobis consequatur animi",
        created_by: "grumpy19",
        votes: 70,
        created_at: 1478813209256
      }
    ];
    expect(formatComments(comments, refObject)).to.eql([
      {
        body: "this is a good book",
        article_id: 1,
        author: "Ikra P",
        votes: 0,
        created_at: new Date(1468087638932)
      },
      {
        body: "Not a good book",
        article_id: 2,
        author: "grumpy19",
        votes: 70,
        created_at: new Date(1478813209256)
      }
    ]);
  });
  it("does not mutate the input array", () => {
    const refObject = { "Js the easy way": 1 };

    const commentArray = [
      {
        body: "You will love Js after reading this book",
        belongs_to: "Js the easy way",
        created_by: "Ikra P",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    const commentArray2 = [
      {
        body: "You will love Js after reading this book",
        belongs_to: "Js the easy way",
        created_by: "Ikra P",
        votes: 7,
        created_at: 1478813209256
      }
    ];
    formatComments(commentArray, refObject);
    expect(commentArray).to.eql(commentArray2);
  });
});
