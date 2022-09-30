import { Context } from "@actions/github/lib/context";
import { Label } from "@octokit/webhooks-types";
import { ReleaseType } from "semver";

type AllowedReleaseTypes = (ReleaseType | "no change")[];

type ReleaseAndPrereleaseId = [ReleaseTypeLabels, string];

const allowedReleaseTypes: AllowedReleaseTypes = [
  "patch",
  "minor",
  "major",
  "prepatch",
  "preminor",
  "premajor",
  "prerelease",
  "no change",
];
const allowedLabels = allowedReleaseTypes.map(
  (version) => `version: ${version}`
);

const re = new RegExp(`version: ${allowedReleaseTypes.join("|")} ?(\w+)`, "i");

export type ReleaseTypeLabels = typeof allowedReleaseTypes[number];

function isApprovedReleaseType(
  releaseType: string
): releaseType is ReleaseTypeLabels {
  return allowedReleaseTypes.includes(releaseType as ReleaseTypeLabels);
}

function isLabelArray(labels: unknown[]): labels is Label[] {
  return labels.every((label) => (label as Label).name !== undefined);
}

function extractReleaseType(label: string): ReleaseAndPrereleaseId {
  const match = re.exec(label);
  if (match === null) {
    Error(`Unable to extract release type from label: ${label}`);
  }

  const [, version, prerelease] = match;
  if (isApprovedReleaseType(version)) {
    return version;
  } else {
    throw Error(`Unable to extract release type from label: ${label}`);
  }
}

export const hasOnlyOneReleaseTypeLabel = (labelNames: string[]) => {
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
      return extractReleaseType(label);
    }
  }

  throw Error("No semver label found");
};
