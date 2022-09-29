const github = require("@actions/github");
const core = require("@actions/core");
const fs = require("fs").promises;

const readFile = (path) => fs.readFile(path, "utf-8");

const context = github.context;

async function run() {
  // Maybe check the event to see if it a push to main?
  // If so, then check semver. Tag and push tags only if changed.

  // Get the label of the pr

  const { GITHUB_WORKSPACE } = process.env;

  if (!GITHUB_WORKSPACE) {
    core.error("The repository has not been checked out.");
    core.error(
      "Ensure you have used actions/checkout to have access to the repository code"
    );
    core.error("Refer to https://github.com/actions/checkout");
    core.setFailed();
    return;
  }

  // Get semver info from the base branch

  // Get semver info from this branch
  core.info(`The event is ${context.eventName}`);
  if (typeof context === "object") {
    core.info("Here are the context keys:");
    Object.keys(context).forEach((key) => core.info(key));
  }

  const labels = context.payload.pull_request?.labels;
  core.info("The pull request has the following labels:");

  if (Array.isArray(labels)) {
    core.info(labels.map((label) => `  - ${label.name}`).join("\n"));
  }

  Object.keys(github).forEach((key) => core.info(key));
  try {
    core.debug(new Date().toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
