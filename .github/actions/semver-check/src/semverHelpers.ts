import path from "path";
import { promises as fs } from "fs";
import { ReleaseTypeLabels } from "./labelHelpers";
import semver from "semver";
import * as core from "@actions/core";

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
  semverLabel: ReleaseTypeLabels
) {
  if (semverLabel === "no change") {
    if (base !== proposed) {
      core.error(`The sever label is: ${semverLabel}`);
      core.setFailed(
        `The base version: ${base} should equal the proposed version: ${proposed}`
      );
      return;
    } else {
      core.info(":white_check_mark: No version change detected.");
      return;
    }
  }

  const calculatedSemver = semver.inc(base, semverLabel);
}
