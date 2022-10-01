import { Context } from "@actions/github/lib/context";
import { Label } from "@octokit/webhooks-types";
import { ReleaseType } from "semver";

type AllowedReleaseTypes = (ReleaseType | "no change")[];
export type ReleaseAndPrereleaseId = [ReleaseTypeLabel, string];

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

const labelRegex = new RegExp(
  `version: ${allowedReleaseTypes.join("|")} ?(\w+)`,
  "i"
);

type ReleaseTypeLabel = typeof allowedReleaseTypes[number];

/**
 * Typeguard. Determine if a string is an allowed release type.
 * @param releaseType A string to compare to the allowed release types.
 * @returns True if the string is one of the allowed release types.
 */
function isApprovedReleaseType(
  releaseType: string
): releaseType is ReleaseTypeLabel {
  return allowedReleaseTypes.includes(releaseType as ReleaseTypeLabel);
}

/**
 * Typeguard. Determine if an array is of label-like objects.
 * @param labels An array of unknown objects.
 * @returns True if each object has a 'name' property.
 */
function isLabelArray(labels: unknown[]): labels is Label[] {
  return labels.every((label) => (label as Label).name !== undefined);
}

/**
 * Extract the release type and prerelease id from the label.
 * @param label
 * @returns A tuple containing the release type and prerelease id (if provided).
 */
export function extractReleaseTypeFromLabel(
  label: string
): ReleaseAndPrereleaseId {
  const match = label.match(labelRegex);

  if (!match) {
    throw Error("Oh no!");
  }

  const [, version, prereleaseId] = match;

  if (isApprovedReleaseType(version)) {
    return [version, prereleaseId];
  } else {
    throw Error(`Unable to extract release type from label: ${label}`);
  }
}

/**
 * A helper to determine if the pull request has exactly one release type label.
 * @param labelNames An array of pull request label names.
 * @returns True if the array of pull request labels has only on release type label.
 */
export const hasOnlyOneReleaseTypeLabel = (labelNames: string[]) => {
  let labelCount = labelNames.reduce((labelCount, label) => {
    if (labelRegex.test(label)) {
      return labelCount++;
    } else {
      return labelCount;
    }
  }, 0);

  return labelCount === 1;
};

/**
 * Get an array of label names from the github context.
 * @param context The github context.
 * @returns An array of label names.
 */
export const getLabelNames = (context: Context) => {
  const labels = context.payload.pull_request?.labels;

  if (isLabelArray(labels)) {
    return labels.map((label) => label.name);
  } else {
    throw Error("Pull request has no labels");
  }
};

/**
 * Get the release type and prerelease id from the pull request label.
 * @param labels An array of labels from the pull request.
 * @returns A tuple containing the release type and the prerelease id.
 */
export const getSemverFromLabels = (labels: string[]) => {
  for (const label of labels) {
    if (labelRegex.test(label)) {
      return extractReleaseTypeFromLabel(label);
    }
  }

  throw Error("No semver label found");
};
