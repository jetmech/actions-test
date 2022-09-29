const github = require("@actions/github");
const core = require("@actions/core");

const context = github.context;

async function run() {
  // Maybe check the event to see if it a push to main?
  // If so, then check semver. Tag and push tags only if changed.

  // some change

  // Get the label of the pr

  // Get semver info from the base branch

  // Get semver info from this branch
  core.info(`The event is ${context.eventName}`);
  if (typeof context === "object") {
    core.info("Here are the context keys:");
    Object.keys(context).forEach((key) => core.info(key));
  }

  const labels = context.payload.pull_request?.labels;
  core.info("The pull request has the following labels");

  if (Array.isArray(labels)) {
    core.info(labels.map((label) => `- ${label}`).join("\n"));
  }

  Object.keys(github).forEach((key) => core.info(key));
  try {
    core.debug(new Date().toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
