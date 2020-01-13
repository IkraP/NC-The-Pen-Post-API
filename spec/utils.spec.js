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
  it("returns a formatted date when input array has one timestamp value", () => {
    // A timestamp value
    const input = [1468087638932];
    expect(formatDates(input)[0]).to.be.an.instanceof(Date);
  });
  it("returns a formatted date when the input array has multiple timestamp values", () => {
    const input = [1468087638932, 1478813209256];
    const output = formatDates(input);
    expect(output[1]).to.be.an.instanceof(Date);
  });
  it("does not mutate the input array", () => {
    const input = [1468087638932, 1478813209256];
    const inputCopy = [1468087638932, 1478813209256];
    formatDates(input);
    expect(input).to.eql(inputCopy);
  });
});

describe("makeRefObj", () => {
  it("return an empty object when input array is empty", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns an object with key value pair of reference required when input array has one object", () => {
    const input = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(input, "title", "article_id")).to.eql({ A: 1 });
  });
  it("returns an object with key value pair of reference required when input array has multiple objects", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "ABC" },
      { article_id: 3, title: "ABCD" }
    ];
    expect(makeRefObj(input, "title", "article_id")).to.eql({
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

describe("formatComments", () => {});
