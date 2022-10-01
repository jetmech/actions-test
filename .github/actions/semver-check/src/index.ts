import * as github from "@actions/github";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import {
  getLabelNames,
  hasOnlyOneReleaseTypeLabel,
  getSemverFromLabels,
} from "./labelHelpers";
import { compareSemver, getSemverFromPackageDotJSON } from "./semverHelpers";

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

    if (!hasOnlyOneReleaseTypeLabel(pullRequestLabels)) {
      throw Error("The pull request requires exactly one semver label.");
    }

    const semverLabel = getSemverFromLabels(pullRequestLabels);

    const baseSemver = await getSemverFromPackageDotJSON(GITHUB_WORKSPACE);

    await exec.exec(`git checkout -q ${context.sha}`);

    const proposedSemver = await getSemverFromPackageDotJSON(GITHUB_WORKSPACE);

    const result = compareSemver(baseSemver, proposedSemver, semverLabel);

    core.info(result);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
