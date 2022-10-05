import * as github from "@actions/github";
import * as core from "@actions/core";

const context = github.context;
const { GITHUB_WORKSPACE } = process.env;

async function run() {
  try {
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
