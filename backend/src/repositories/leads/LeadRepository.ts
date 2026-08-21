import { getPrisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class LeadRepository {
  private get prisma() {
    return getPrisma();
  }

  async createLead(data: Prisma.LeadCreateInput) {
    return this.prisma.lead.create({ data });
  }

  async getLeadById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: { enrichmentData: true },
    });
  }

  async getAllLeads(organizationId: string) {
    return this.prisma.lead.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLead(id: string, data: Prisma.LeadUpdateInput) {
    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }

  async deleteLead(id: string) {
    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
