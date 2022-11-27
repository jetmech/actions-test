import { compareSemver, getSemverFromPackageDotJSON } from "../semverHelpers";
import { ReleaseAndPrereleaseId } from "../labelHelpers";
import { promises as fs } from "fs";
import semver, { ReleaseType } from "semver";

describe(".getSemVerFromPackageDotJSON()", () => {
  it("returns the version of a package", async () => {
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

  describe.each([
    {
      base: "1.0.0",
      proposed: "1.0.1",
      version: "patch",
      prereleaseId: undefined,
    },
    {
      base: "1.0.0",
      proposed: "1.1.0",
      version: "minor",
      prereleaseId: undefined,
    },
    {
      base: "1.0.0",
      proposed: "2.0.0",
      version: "major",
      prereleaseId: undefined,
    },
    {
      base: "1.0.0",
      proposed: "1.0.1-alpha.0",
      version: "prepatch",
      prereleaseId: "alpha",
    },
    {
      base: "1.0.0",
      proposed: "1.1.0-alpha.0",
      version: "preminor",
      prereleaseId: "alpha",
    },
    {
      base: "1.0.0",
      proposed: "2.0.0-alpha.0",
      version: "premajor",
      prereleaseId: "alpha",
    },
    {
      base: "2.0.0-alpha.0",
      proposed: "2.0.0-alpha.1",
      version: "prerelease",
      prereleaseId: "alpha",
    },
  ])(
    "when releaseInfo is ['$version', $prereleaseId]",
    ({ base, proposed, version, prereleaseId }) => {
      it("returns the correct string when the proposed release type is correct", () => {
        const realeaseInfo: ReleaseAndPrereleaseId = [
          version as ReleaseType,
          prereleaseId,
        ];

        const result = compareSemver(base, proposed, realeaseInfo);

        expect(result).toEqual(
          `The proposed version (${proposed}) matches the calculated version.`
        );
      });
      it("throws an error when the proposed release type is not correct", () => {
        const wrongProposed = semver.inc(proposed, version as ReleaseType);
        const realeaseInfo: ReleaseAndPrereleaseId = ["minor", undefined];

        if (!wrongProposed) {
          throw Error("semver.inc called with invalid parameters");
        }

        const shouldThrow = () => {
          compareSemver(base, wrongProposed, realeaseInfo);
        };

        expect(shouldThrow).toThrow();
      });
    }
  );

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
