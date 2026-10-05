import * as services from "./services";

function run(_app?: any) {}

export default {
  isPublished: true,
  name: "Appointment",
  run,
  services,
};

export { services };
export * from "./models";
