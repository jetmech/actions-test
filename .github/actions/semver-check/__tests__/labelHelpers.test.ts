import {
  hasOnlyOneReleaseTypeLabel,
  getReleaseTypeFromLabels,
} from "../src/labelHelpers";

const testLabels = ["Version: prepatch alpha", "foo", "bar", "bar"];

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

  describe("getReleaseTypeFromLabels", () => {
    it("extracts the release type and prerelease id as tuple [ReleaseType, prereleaseId]", () => {
      const result = getReleaseTypeFromLabels(testLabels);

      const expected = ["prepatch", "alpha"];
      expect(result).toEqual(expected);
    });
  });
});
