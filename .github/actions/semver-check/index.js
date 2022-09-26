const github = require("@actions/github");
const core = require("@actions/core");

const context = { github };

async function run() {
  try {
    core.debug(new Date().toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
