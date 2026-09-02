import { LeadRepository } from '../../repositories/leads/LeadRepository';
import { NormalizationPipeline } from '../../utils/normalization';

export interface CreateLeadData {
  organizationId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export class LeadService {
  private leadRepository: LeadRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
  }

  async createLead(data: CreateLeadData) {
    const { organizationId, ...leadData } = data;

    const normalizedData = {
      ...leadData,
      email: NormalizationPipeline.normalizeEmail(leadData.email),
      firstName: leadData.firstName
        ? NormalizationPipeline.normalizeName(leadData.firstName)
        : undefined,
      lastName: leadData.lastName
        ? NormalizationPipeline.normalizeName(leadData.lastName)
        : undefined,
      companyName: leadData.companyName
        ? NormalizationPipeline.normalizeCompanyName(leadData.companyName)
        : undefined,
    };

    const prismaData = {
      ...normalizedData,
      organization: {
        connect: {
          id: organizationId,
        },
      },
    };

    return this.leadRepository.createLead(prismaData);
  }

  async getLead(id: string) {
    return this.leadRepository.getLeadById(id);
  }

  async getAllLeads(organizationId: string) {
    return this.leadRepository.getAllLeads(organizationId);
  }

  async updateLead(id: string, data: Record<string, unknown>) {
    return this.leadRepository.updateLead(id, data);
  }

  async deleteLead(id: string) {
    return this.leadRepository.deleteLead(id);
  }
}