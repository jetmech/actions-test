const fs = require("fs").promises;
const path = require("path");

const { GITHUB_WORKSPACE } = process.env;

type PackageDotJSON = {
  version: string;
};

const getSemver = () =>
  fs
    .readFile(path.join(GITHUB_WORKSPACE, "package.json"), "utf-8")
    .then((projectPackage: string) => JSON.parse(projectPackage))
    .then((parsedPackage: PackageDotJSON) => parsedPackage.version);

module.exports = {
  getSemver,
};
