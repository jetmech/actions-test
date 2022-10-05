import * as github from "@actions/github";
import * as core from "@actions/core";

const createListFromObjectKeys = (obj: {}) =>
  Object.keys(obj)
    .map((key) => `- ${key}`)
    .join("\n");

async function run() {
  try {
    core.info("## The following are environment variables:");
    core.info(createListFromObjectKeys(process.env));

    core.info("## The following are available on the github context:");
    core.info(createListFromObjectKeys(github.context));
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
