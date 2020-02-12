module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/(?!@foo)"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      diagnostics: {
        warnOnly: true
      }
    }
  },
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/tsc/$1"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!@foo)"],
  preset: "ts-jest",
  testMatch: null
};
