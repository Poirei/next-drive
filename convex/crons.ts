import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete all files marked for deletion",
  { minutes: 1 }, // every minute
  internal.files.deleteFilesMarkedForDeletion,
);

export default crons;
