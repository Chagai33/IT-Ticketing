import { User, UserRole } from "../../domain/entities";

export interface CsvUserRecord {
  name: string;
  email: string;
  role: UserRole;
  divisionId?: string;
  branchId?: string;
}

export class CsvUserImporter {
  /**
   * Parses CSV string and returns user objects
   * Format: name,email,role,divisionId,branchId
   */
  async parse(csvContent: string, tenantId: string): Promise<Omit<User, 'id' | 'createdAt'>[]> {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');

    // Skip header and map
    return lines.slice(1).map(line => {
      const [name, email, role, divisionId, branchId] = line.split(',').map(v => v.trim());

      return {
        tenantId,
        name,
        email,
        role: (role as UserRole) || 'USER',
        divisionId,
        branchId,
        source: 'CSV',
        isGuest: false,
      };
    });
  }
}
