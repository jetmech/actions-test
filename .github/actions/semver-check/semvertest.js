const semver = require("semver");

const base = "1.0.0";
const prerelease = semver.inc(base, "prerelease", "alpha");

const types = [
  "patch",
  "minor",
  "major",
  "prepatch",
  "preminor",
  "premajor",
  "prerelease",
];

const log = (type) =>
  console.log(`Type: ${type} Output: ${semver.inc(base, type, "alpha")}`);

types.forEach(log);

console.log("Now for the pre-release stuff:");
console.log(
  `The base has been incremented using prerelease and alpha: ${prerelease}`
);
console.log(
  `Now we run semver.inc(prerelease, "prerelease"): ${semver.inc(
    prerelease,
    "prerelease"
  )}`
);

console.log(
  `Now we run semver.inc(prerelease, "prepatch"): ${semver.inc(
    prerelease,
    "prepatch"
  )}`
);

const allowedReleaseTypes = [
  "patch",
  "minor",
  "major",
  "prepatch",
  "preminor",
  "premajor",
  "prerelease",
  "no change",
];

const re = new RegExp(`version: ${allowedReleaseTypes.join("|")} ?(\w+)`, "i");

console.log(re.test("version: minor alpha"));
