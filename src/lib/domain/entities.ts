export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'USER';
export type TicketStatus = 'OPEN' | 'WAITING_USER' | 'WAITING_TECH' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AssetType = 'LAPTOP' | 'DESKTOP' | 'MOBILE' | 'PRINTER' | 'NETWORK' | 'PERIPHERAL' | 'OTHER';
export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_REPAIR' | 'RETIRED' | 'LOST';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  divisionId?: string;
  branchId?: string;
  source: 'AD' | 'CSV' | 'MANUAL' | 'SELF_REGISTERED';
  isGuest: boolean;
  createdAt: Date;
  deletedAt?: Date;
}

export interface Ticket {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  creatorId: string;
  assignedTechnicianId?: string;
  computerId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TicketEvent {
  id: string;
  ticketId: string;
  type: 'COMMENT' | 'STATUS_CHANGE' | 'MERGE' | 'AI_AUTO_REPLY';
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface Asset {
  id: string;
  tenantId: string;
  name: string;
  serialNumber: string;
  assetTag: string;
  type: AssetType;
  status: AssetStatus;
  assignedToId?: string; // User ID
  location?: string;
  specs: Record<string, any>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AssetAudit {
  id: string;
  assetId: string;
  performedById: string;
  statusAtAudit: AssetStatus;
  locationAtAudit?: string;
  signatureUrl?: string; // Signed path to verification signature
  notes?: string;
  createdAt: Date;
}


export interface VaultItem {
  id: string;
  tenantId: string;
  title: string;
  category: 'PASSWORD' | 'SSH_KEY' | 'API_TOKEN' | 'OTHER';
  value: string; // ENCRYPTED
  notes?: string;
  entityId?: string;
  entityType?: 'ASSET' | 'USER';
  updatedBy: string;
  updatedAt: Date;
}
