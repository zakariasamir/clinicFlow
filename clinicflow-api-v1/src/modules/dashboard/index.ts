import * as services from "./services";

function run(_app?: any) {}

export default {
  isPublished: true,
  name: "Dashboard",
  run,
  services,
};

export { services };
export * from "./models";
