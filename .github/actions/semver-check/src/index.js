const github = require("@actions/github");
const core = require("@actions/core");
const fs = require("fs").promises;
const path = require("path");
const exec = require("@actions/exec");

const context = github.context;
const { GITHUB_WORKSPACE } = process.env;
const getSemver = () =>
  fs
    .readFile(path.join(GITHUB_WORKSPACE, "package.json"), "utf-8")
    .then((package) => JSON.parse(package))
    .then((parsedPackage) => parsedPackage.version);

async function run() {
  // Maybe check the event to see if it a push to main?
  // If so, then check semver. Tag and push tags only if changed.

  // Get the label of the pr

  if (!GITHUB_WORKSPACE) {
    core.error("The repository has not been checked out.");
    core.error(
      "Ensure you have used actions/checkout to have access to the repository code"
    );
    core.error("Refer to https://github.com/actions/checkout");
    core.setFailed();
    return;
  }

  // const labels = context.payload.pull_request?.labels;

  // if (Array.isArray(labels)) {
  //   core.info(labels.map((label) => `  - ${label.name}`).join("\n"));
  // }

  try {
    // Get semver info from the base branch
    const proposedSemver = await getSemver();

    await exec.exec(`cd ${GITHUB_WORKSPACE} git checkout main`);

    const baseSemver = await getSemver();

    core.info(`The proposed semver is ${proposedSemver}`);
    core.info(`The base semver is ${baseSemver}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
