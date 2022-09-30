const allowedLabels = ["minor", "major", "patch"];

const hasOnlyOneSemverLabel = (labels) => {
  let labelCount = labels.reduce((labelCount, label) => {
    if (allowedLabels.includes(label)) {
      return labelCount++;
    } else {
      return labelCount;
    }
  }, 0);

  return labelCount === 1;
};

const getLabelNames = (context) =>
  context.payload.pull_request?.labels.map((label) => label.name);

const getSemverLabel = (labels) => {
  for (const label of labels) {
    if (allowedLabels.includes(label)) {
      return label;
    }
  }
};

module.exports = {
  hasOnlyOneSemverLabel,
  getLabelNames,
  getSemverLabel,
};
