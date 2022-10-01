import path from "path";
import { promises as fs } from "fs";
import { ReleaseAndPrereleaseId } from "./labelHelpers";
import semver from "semver";
import * as core from "@actions/core";

type PackageDotJSON = {
  version: string;
};

/**
 * Get the package.json version from a checked out repository.
 * @param workspace The workspace that contains the repository code.
 * @returns The package.json version.
 */
export const getSemverFromPackageDotJSON = (workspace: string) =>
  fs
    .readFile(path.join(workspace, "package.json"), "utf-8")
    .then((projectPackage: string) => JSON.parse(projectPackage))
    .then((parsedPackage: PackageDotJSON) => parsedPackage.version);

/**
 *
 * @param base The SemVer in the base branch of hte pull request.
 * @param proposed The SemVer proposed in this pull request.
 * @param releaseInfo A tuple containing the release type and the prerelease id.
 * @returns A string describing the result of the comparison.
 */
export function compareSemver(
  base: string,
  proposed: string,
  releaseInfo: ReleaseAndPrereleaseId
) {
  const [release, prereleaseId] = releaseInfo;
  if (release === "no change") {
    if (base !== proposed) {
      throw Error(
        `The base version: ${base} should equal the proposed version: ${proposed}`
      );
    } else {
      return ":white_check_mark: No version change detected.";
    }
  }

  const calculatedSemver = semver.inc(base, release, prereleaseId);

  if (calculatedSemver !== proposed) {
    throw new Error(
      `The proposed version ${proposed} does not match the calculated version ${calculatedSemver}.`
    );
  } else {
    return `:white_check_mark: The proposed version ${proposed} matches the calculated version ${calculatedSemver}.`;
  }
}
