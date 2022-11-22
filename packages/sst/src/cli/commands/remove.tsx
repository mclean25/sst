import type { Program } from "../program.js";
import { printDeploymentResults } from "../ui/deploy.js";

export const remove = (program: Program) =>
  program.command(
    "remove",
    "Remove all stacks for this app",
    (yargs) => yargs.option("from", { type: "string" }),
    async (args) => {
      const React = await import("react");
      const { CloudAssembly } = await import("aws-cdk-lib/cx-api");
      const { blue, bold } = await import("colorette");
      const { useProject } = await import("../../app.js");
      const { Stacks } = await import("../../stacks/index.js");
      const { render } = await import("ink");
      const { DeploymentUI } = await import("../ui/deploy.js");

      const assembly = await (async function () {
        if (args.from) {
          const result = new CloudAssembly(args.from);
          return result;
        }

        const fn = await Stacks.build();
        return await Stacks.synth({
          fn,
          mode: "remove",
        });
      })();

      const project = useProject();
      console.log(
        `Removing ${bold(assembly.stacks.length + " stacks")} for stage ${blue(
          project.stage
        )}...`
      );
      process.stdout.write("\x1b[?1049h");
      const component = render(
        <DeploymentUI stacks={assembly.stacks.map((s) => s.stackName)} />
      );
      const results = await Stacks.removeMany(assembly.stacks);
      component.unmount();
      process.stdout.write("\x1b[?1049l");
      printDeploymentResults(results);
      process.exit(0);
    }
  );
