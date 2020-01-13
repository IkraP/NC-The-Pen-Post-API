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
  it("returns a single date array when input array has one timestamp value", () => {
    // A timestamp value
    const input = [1549312452];
    expect(formatDates(input[0])).to.be.an.instanceof(Date);

    // const input = 1549312452;
    // const d = new Date(input * 1000);
    // timeStampCon =
    //   d.getDate() +
    //   "/" +
    //   d.getMonth() +
    //   "/" +
    //   d.getFullYear() +
    //   " " +
    //   d.getHours() +
    //   ":" +
    //   d.getMinutes();
    // // .getTime();
    // console.log(timeStampCon);
    // console.log(d instanceof Date);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
