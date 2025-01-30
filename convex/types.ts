import { getFiles } from "./files";

export type FileType = Awaited<ReturnType<typeof getFiles>>[number];
