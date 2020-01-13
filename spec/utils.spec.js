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
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
