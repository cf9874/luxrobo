export const FeatureUtil = {
  optionTitle: (optionTitle: string) => {
    return optionTitle.replaceAll(" ", "").replaceAll("of", "Of").replaceAll("-", "")
  },
}
