import { Context } from "@actions/github/lib/context";
import {
  hasOnlyOneReleaseTypeLabel,
  getReleaseTypeFromLabels,
  getLabelNames,
  noReleaseLabelErrorMessage,
} from "../labelHelpers";

const testLabels = ["Version: prepatch alpha", "foo", "bar", "baz"];

type LabeLike = { name: string };

const createGithubContext = (labels: LabeLike[]) =>
  ({
    payload: {
      pull_request: {
        number: 42,
        labels,
      },
    },
  } as Partial<Context>);

getLabelNames(createGithubContext([{ name: "foo" }]) as Context);

describe(".hasOnlyOneReleaseTypeLabel()", () => {
  it("Returns true if the array of label names has only one release type label", () => {
    const result = hasOnlyOneReleaseTypeLabel(testLabels);

    expect(result).toBe(true);
  });
  it("Returns false if the array of label names has more than one release type label", () => {
    const testLabels = ["Version: minor", "Version: major"];

    const result = hasOnlyOneReleaseTypeLabel(testLabels);

    expect(result).toBe(false);
  });
});

describe(".getReleaseTypeFromLabels()", () => {
  it("extracts the release type and prerelease id as tuple [ReleaseType, prereleaseId]", () => {
    const result = getReleaseTypeFromLabels(testLabels);

    const expected = ["prepatch", "alpha"];
    expect(result).toEqual(expected);
  });
  it("the second value of the tuple is undefined if no prerelease id is in the label", () => {
    const testLabels = ["Version: patch"];
    const result = getReleaseTypeFromLabels(testLabels);

    const expected = ["patch", undefined];
    expect(result).toEqual(expected);
  });
  it("throws an error if there are no release type labels", () => {
    const testLabels = ["foo"];

    const shouldThrow = () => {
      getReleaseTypeFromLabels(testLabels);
    };

    expect(shouldThrow).toThrow(noReleaseLabelErrorMessage);
  });
});

describe(".getLabelNames()", () => {
  it("returns an array of labes names when passed the GitHub context", () => {
    const labels = [{ name: "foo" }, { name: "bar" }];
    const context = createGithubContext(labels);

    const expectedLabelNames = labels.map((label) => label.name);

    expect(getLabelNames(context as Context)).toEqual(expectedLabelNames);
  });

  it("throws an error if the pull request is not labeled", () => {
    const context = createGithubContext([]);

    const shouldThrow = () => {
      getLabelNames(context as Context);
    };

    expect(shouldThrow).toThrow("The pull request has no labels");
  });
});
