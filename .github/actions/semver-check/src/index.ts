import * as github from "@actions/github";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import semver from "semver";
import {
  getLabelNames,
  hasOnlyOneSemverLabel,
  getSemverFromLabels,
} from "./labelHelpers";
import { getSemverFromPackageDotJSON } from "./semverHelpers";

const context = github.context;
const { GITHUB_WORKSPACE } = process.env;

async function run() {
  // Maybe check the event to see if it a push to main?
  // If so, then check semver. Tag and push tags only if changed.

  if (!GITHUB_WORKSPACE) {
    core.error(
      "Ensure you have used actions/checkout to have access to the repository code"
    );
    core.error("Refer to https://github.com/actions/checkout");
    core.setFailed("The repository has not been checked out.");
    return;
  }

  try {
    const pullRequestLabels = getLabelNames(context);

    if (!pullRequestLabels) {
      core.setFailed("There were no labels found in this pull request");
      return;
    }

    if (!hasOnlyOneSemverLabel(pullRequestLabels)) {
      core.setFailed("The pull request requires exactly one semver label.");
      return;
    }

    const semverLabel = getSemverFromLabels(pullRequestLabels);

    // Get semver info from the base branch
    const baseSemver = await getSemverFromPackageDotJSON(GITHUB_WORKSPACE);

    await exec.exec(`git checkout -q ${context.sha}`);

    const proposedSemver = await getSemverFromPackageDotJSON(GITHUB_WORKSPACE);

    if (semverLabel === "no change") {
      if (baseSemver !== proposedSemver) {
        core.error(`The sever label is: ${semverLabel}`);
        core.setFailed(
          `The base version: ${baseSemver} should equal the proposed version: ${proposedSemver}`
        );
        return;
      } else {
        core.info(":white_check_mark: No version change detected.");
        return;
      }
    }

    const calculatedSemver = semver.inc(baseSemver, semverLabel);

    core.info(`The proposed package version is ${proposedSemver}`);
    core.info(`The base package version is ${baseSemver}`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
