const github = require("@actions/github");
const core = require("@actions/core");
const exec = require("@actions/exec");
const {
  getLabelNames,
  hasOnlyOneSemverLabel,
  getSemverLabel,
} = require("./labelHelpers");
const { getSemver } = require("./getSemver");

const context = github.context;
const { GITHUB_WORKSPACE } = process.env;

async function run() {
  // Maybe check the event to see if it a push to main?
  // If so, then check semver. Tag and push tags only if changed.

  if (!GITHUB_WORKSPACE) {
    core.error("The repository has not been checked out.");
    core.error(
      "Ensure you have used actions/checkout to have access to the repository code"
    );
    core.error("Refer to https://github.com/actions/checkout");
    core.setFailed();
    return;
  }

  try {
    const pullRequestLabels = getLabelNames(context);

    if (!hasOnlyOneSemverLabel(pullRequestLabels)) {
      core.setFailed("The pull request requires exactly one semver label.");
      return;
    }

    const semverLabel = getSemverLabel(pullRequestLabels);

    // Get semver info from the base branch
    const baseSemver = await getSemver();

    await exec.exec(`git checkout -q ${context.sha}`);

    const proposedSemver = await getSemver();

    core.info(`The proposed semver is ${proposedSemver}`);
    core.info(`The base semver is ${baseSemver}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
