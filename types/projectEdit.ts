import { z } from "zod";
import { editProjectSchema } from "~/schema/projectEdit";

export type EditProjectInput = z.infer<typeof editProjectSchema>;