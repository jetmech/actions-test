import { Context } from "@actions/github/lib/context";
import { Label } from "@octokit/webhooks-types";

const allowedVersions = ["patch", "minor", "major", "no change"] as const;
const allowedLabels = allowedVersions.map((version) => `version: ${version}`);

type SemverVersions = typeof allowedVersions[number];

const labelVersionRegex = /version: /i;

function getSemverFromLabel(label: string): SemverVersions {
  return "foo";
}

function isLabelArray(labels: unknown[]): labels is Label[] {
  return labels.every((label) => (label as Label).name !== undefined);
}

export const hasOnlyOneSemverLabel = (labelNames: string[]) => {
  let labelCount = labelNames.reduce((labelCount, label) => {
    if (allowedLabels.includes(label.toLocaleLowerCase())) {
      return labelCount++;
    } else {
      return labelCount;
    }
  }, 0);

  return labelCount === 1;
};

export const getLabelNames = (context: Context) => {
  const labels = context.payload.pull_request?.labels;

  if (isLabelArray(labels)) {
    return labels.map((label) => label.name);
  }
};

export const getSemverFromLabels = (labels: string[]) => {
  for (const label of labels) {
    if (allowedLabels.includes(label)) {
      return label;
    }
  }
};
