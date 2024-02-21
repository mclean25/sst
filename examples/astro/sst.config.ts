/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "astro",
      removalPolicy: input?.stage === "production" ? "retain" : "remove",
      providers: {
        aws: {},
      },
    };
  },
  async run() {
    new sst.aws.Astro("Web");
  },
});
