import * as github from "@actions/github";
import * as core from "@actions/core";

const createListFromObjectKeys = (obj: {}) =>
  Object.keys(obj)
    .map((key) => `- ${key}`)
    .join("\n");

const getKeys = (obj: {}) => Object.keys(obj).map((key) => `- ${key}`);

async function run() {
  try {
    core.info("## The following are environment variables:");
    core.info(createListFromObjectKeys(process.env));

    core.info("## The following are available on the github context:");
    core.info(createListFromObjectKeys(github.context));

    core.summary
      .addHeading("The following are environment variables:", 2)
      .addList(getKeys(process.env))
      .addBreak()
      .addHeading("The following are available on the github context:", 2)
      .addList(getKeys(github.context))
      .write();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
