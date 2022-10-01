import { hasOnlyOneReleaseTypeLabel } from "../src/labelHelpers";

describe(".hasOnlyOneReleaseTypeLabel()", () => {
  it("Returns true if the array of label names has only one release type label", () => {
    const testLabels = ["Version: minor", "foo", "bar", "bar"];

    // const result = hasOnlyOneReleaseTypeLabel(testLabels)
    // expect(result).toBe(true);
  });
});
