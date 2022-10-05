import { Context } from "@actions/github/lib/context";
import { Label } from "@octokit/webhooks-types";
import { ReleaseType } from "semver";

type AllowedReleaseTypes = (ReleaseType | "no change")[];
export type ReleaseAndPrereleaseId = [ReleaseTypeLabel, string | undefined];

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
  `version: (${allowedReleaseTypes.join("|")}) ?(\\w+)?`,
  "i"
);

type ReleaseTypeLabel = AllowedReleaseTypes[number];

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
 * Determine if the pull request has exactly one release type label.
 * @param labelNames An array of pull request label names.
 * @returns True if the array of pull request labels has only on release type label.
 */
export const hasOnlyOneReleaseTypeLabel = (labelNames: string[]) => {
  let labelCount = labelNames.reduce((labelCount, label) => {
    if (labelRegex.test(label)) {
      return labelCount + 1;
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
  let labelNames: string[] = [];

  if (isLabelArray(labels)) {
    labelNames = labels.map((label) => label.name);
  }

  if (labelNames.length === 0) {
    throw Error("The pull request has no labels.");
  } else {
    return labelNames;
  }
};

const createReleaseTypeList = () =>
  allowedReleaseTypes
    .map(
      (releaseType) =>
        `  - Version: ${releaseType}${
          releaseType.startsWith("pre") ? " prereleaseId" : ""
        }`
    )
    .join("\n");

export const noReleaseLabelErrorMessage = `No release label found.

The pull request requires one of the following
labels determined by your intended release type:
${createReleaseTypeList()}
Note: The prereleaseId is optional and is only used for
prerelease, prepatch, preminor and premajor release types.

For example, you may have an alpha, beta or rc prerelease id.
You can label the pull request with "Version: premajor alpha"
to facilitate an alpha release, etc...

This action is built using https://www.npmjs.com/package/semver.
Please refer to the link above for notes on npm semantic versioning.
`;

/**
 * Get the release type and prerelease id from the pull request label.
 * @param labels An array of labels from the pull request.
 * @returns A tuple containing the release type and the prerelease id.
 */
export const getReleaseTypeFromLabels = (
  labels: string[]
): ReleaseAndPrereleaseId => {
  for (const label of labels) {
    const match = label.match(labelRegex);
    if (match) {
      const [, releaseType, prereleaseId] = match;
      const lowerCaseReleaseType = releaseType.toLowerCase();
      if (isApprovedReleaseType(lowerCaseReleaseType)) {
        return [lowerCaseReleaseType, prereleaseId];
      }
    }
  }

  throw Error(noReleaseLabelErrorMessage);
};
