import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "TECHNICIAN", "USER"]);
export const TicketStatusSchema = z.enum(["OPEN", "WAITING_USER", "WAITING_TECH", "RESOLVED", "CLOSED"]);
export const TicketPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const AssetTypeSchema = z.enum(["LAPTOP", "DESKTOP", "MOBILE", "PRINTER", "NETWORK", "PERIPHERAL", "OTHER"]);
export const AssetStatusSchema = z.enum(["AVAILABLE", "ASSIGNED", "IN_REPAIR", "RETIRED", "LOST"]);

export const CreateTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: TicketPrioritySchema,
  computerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateTicketSchema = z.object({
  status: TicketStatusSchema.optional(),
  priority: TicketPrioritySchema.optional(),
  assignedTechnicianId: z.string().optional(),
  computerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const AddCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export const CreateAssetSchema = z.object({
  name: z.string().min(2, "Name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  assetTag: z.string().min(1, "Asset tag is required"),
  type: AssetTypeSchema,
  status: AssetStatusSchema,
  assignedToId: z.string().optional(),
  location: z.string().optional(),
  specs: z.record(z.string(), z.any()).default({}),
  notes: z.string().optional(),
});

export const UpdateAssetSchema = CreateAssetSchema.partial();
