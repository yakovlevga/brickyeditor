module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/(?!@foo)"],

  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json",
      enableTsDiagnostics: true
    }
  },

  moduleFileExtensions: ["ts", "tsx", "js"],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/tsc/$1"
  },

  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  transformIgnorePatterns: ["<rootDir>/node_modules/(?!@foo)"]
};
