import { LeadRepository } from '../../repositories/leads/LeadRepository';
import { Prisma } from '@prisma/client';
import { NormalizationPipeline } from '../../utils/normalization';

export class LeadService {
  private leadRepository: LeadRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
  }

  async createLead(data: Prisma.LeadCreateInput) {
    const normalizedData = {
      ...data,
      email: NormalizationPipeline.normalizeEmail(data.email),
      firstName: data.firstName ? NormalizationPipeline.normalizeName(data.firstName) : undefined,
      lastName: data.lastName ? NormalizationPipeline.normalizeName(data.lastName) : undefined,
      companyName: data.companyName ? NormalizationPipeline.normalizeCompanyName(data.companyName) : undefined,
      domain: data.domain ? NormalizationPipeline.normalizeDomain(data.domain) : undefined,
    };
    return this.leadRepository.createLead(normalizedData);
  }

  async getLead(id: string) {
    return this.leadRepository.getLeadById(id);
  }

  async getAllLeads(organizationId: string) {
    return this.leadRepository.getAllLeads(organizationId);
  }

  async updateLead(id: string, data: Prisma.LeadUpdateInput) {
    return this.leadRepository.updateLead(id, data);
  }

  async deleteLead(id: string) {
    return this.leadRepository.deleteLead(id);
  }
}
