const fs = require("fs").promises;
const path = require("path");

const { GITHUB_WORKSPACE } = process.env;

const getSemver = () =>
  fs
    .readFile(path.join(GITHUB_WORKSPACE, "package.json"), "utf-8")
    .then((package) => JSON.parse(package))
    .then((parsedPackage) => parsedPackage.version);

module.exports = {
  getSemver,
};
