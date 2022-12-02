# Pull Request SemVer Validator

A GitHub action for validating the SemVer for a pull request.

## Example usages

This action is built using the nodejs semver package.

Each pull request must be labelled like the following example:

```
Version: $yourVersion
```

where $yourVersion is one that is supported by the semver package. The following are valid options:

- patch
- minor
- major
- prepatch
- preminor
- premajor
- prerelease

If you use any of the "pre" prefixed versions, you should also
provide the release type. Eg: alpha, beta, rc, etc...

For a prepatch alpha, you would label your pull request with:

```
Version: prepatch alpha
```

The action will compare the package.json version in the base branch with the package.json in the head branch.

If the version in the head branch package.json is not incremented to match the calculated version (based on the pull request label), the action will fail with an error telling you that the versions do not match.

If you do not wish to make any changes to the package version, use the following label on your pull request:

```
Version: no change
```

This action relies on having the code checked out. You must use [actions/checkout](https://github.com/actions/checkout) in your workflow prior to using this action.

The types labeled, unlabeled, opened and synchronize are required to ensure that this action runs if the labels are changed or if the head branch is updated.

If the package.json version is changed in the base branch after the pull request is raised, you'll have to handle the merge conflict prior to a merge. This will trigger the 'synchronize' event which will ensure that your package.json version is correct.

Refer to the following example workflow file:

```yaml
name: Check SemVer

on:
  pull_request:
    branches: ["main"]
    types:
      - labeled
      - unlabeled
      - opened
      - synchronize

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Check SemVer
        uses: jetmech/semver-check@v1
```
