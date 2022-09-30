import { Context } from "@actions/github/lib/context";
import { Label } from "@octokit/webhooks-types";

const allowedVersions = ["patch", "minor", "major", "no change"] as const;
const allowedLabels = allowedVersions.map((version) => `version: ${version}`);

export type SemverVersion = typeof allowedVersions[number];

function isApprovedVesrion(version: string): version is SemverVersion {
  return allowedVersions.includes(version as SemverVersion);
}

function isLabelArray(labels: unknown[]): labels is Label[] {
  return labels.every((label) => (label as Label).name !== undefined);
}

function extractSemver(label: string): SemverVersion {
  const [, version] = label.split(/version: /i);
  if (isApprovedVesrion(version)) {
    return version;
  } else {
    throw Error(`Unable to extract semver from label: ${label}`);
  }
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
  } else {
    throw Error("Pull request has no labels");
  }
};

export const getSemverFromLabels = (labels: string[]) => {
  for (const label of labels) {
    if (allowedLabels.includes(label)) {
      return extractSemver(label);
    }
  }

  throw Error("No semver label found");
};
