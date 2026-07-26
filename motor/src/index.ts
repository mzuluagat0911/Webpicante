import { orchestrate } from "./agents/orchestrator.js";
import { log } from "./lib/logger.js";

const command = process.argv[2] ?? "run";

orchestrate(command)
  .then(() => {
    log.ok("Motor de blog: corrida terminada.");
    process.exit(0);
  })
  .catch((err) => {
    log.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
