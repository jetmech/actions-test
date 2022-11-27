import { compareSemver, getSemverFromPackageDotJSON } from "../semverHelpers";
import * as exec from "@actions/exec";
import { ReleaseAndPrereleaseId } from "../labelHelpers";
import { promises as fs } from "fs";

describe(".getSemVerFromPackageDotJSON()", () => {
  it("returns the version of a package", async () => {
    const spy = jest.spyOn(exec, "exec").mockResolvedValue(0);
    // jest.spyOn(JSON, "parse").mockReturnValue({ version: "1.0.0" });
    jest.spyOn(fs, "readFile").mockResolvedValue(`{ "version": "1.0.0" }`);

    const result = await getSemverFromPackageDotJSON("foo");

    expect(result).toBe("1.0.0");
  });
});

describe(".compareSemver()", () => {
  describe("when releaseInfo is ['no change', <string>]", () => {
    it("returns 'No version change detected.' when the base release type is the same as the proposed release type", () => {
      const base = "1.0.0";
      const proposed = "1.0.0";
      const realeaseInfo: ReleaseAndPrereleaseId = ["no change", undefined];

      const result = compareSemver(base, proposed, realeaseInfo);

      expect(result).toEqual("No version change detected.");
    });
    it("throws an error when the base release type is not the same as the proposed release type", () => {
      const base = "1.0.0";
      const proposed = "1.0.1";
      const realeaseInfo: ReleaseAndPrereleaseId = ["no change", undefined];

      const shouldThrow = () => {
        compareSemver(base, proposed, realeaseInfo);
      };

      expect(shouldThrow).toThrow();
    });
  });

  describe("when releaseInfo is ['minor', <string>]", () => {
    it("returns the correct string when the proposed release type is correct", () => {
      const base = "1.0.0";
      const proposed = "1.1.0";
      const realeaseInfo: ReleaseAndPrereleaseId = ["minor", undefined];

      const result = compareSemver(base, proposed, realeaseInfo);

      expect(result).toEqual(
        "The proposed version (1.1.0) matches the calculated version."
      );
    });
    it("throws an error when the proposed release type is not correct", () => {
      const base = "1.0.0";
      const proposed = "1.2.0";
      const realeaseInfo: ReleaseAndPrereleaseId = ["minor", undefined];

      const shouldThrow = () => {
        compareSemver(base, proposed, realeaseInfo);
      };

      expect(shouldThrow).toThrow();
    });
  });

  describe("prepatch id's", () => {
    it("returns the correct string when the proposed release type is correct", () => {
      const base = "1.0.0";
      const proposed = "1.0.1-alpha.0";
      const realeaseInfo: ReleaseAndPrereleaseId = ["prepatch", "alpha"];

      const result = compareSemver(base, proposed, realeaseInfo);

      expect(result).toEqual(
        "The proposed version (1.0.1-alpha.0) matches the calculated version."
      );
    });
  });
});
