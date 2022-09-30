import path from "path";
import { promises as fs } from "fs";
import { SemverVersion } from "./labelHelpers";

type PackageDotJSON = {
  version: string;
};

export const getSemverFromPackageDotJSON = (workspace: string) =>
  fs
    .readFile(path.join(workspace, "package.json"), "utf-8")
    .then((projectPackage: string) => JSON.parse(projectPackage))
    .then((parsedPackage: PackageDotJSON) => parsedPackage.version);

export function compareSemver(
  base: string,
  proposed: string,
  semver: SemverVersion
) {}
