import { CampaignRepository } from '../../repositories/campaigns/CampaignRepository';
import { Prisma } from '@prisma/client';

export class CampaignService {
  private campaignRepository: CampaignRepository;

  constructor() {
    this.campaignRepository = new CampaignRepository();
  }

  async createCampaign(data: Prisma.CampaignCreateInput) {
    return this.campaignRepository.createCampaign(data);
  }

  async getCampaign(id: string) {
    return this.campaignRepository.getCampaignById(id);
  }

  async getAllCampaigns(organizationId: string) {
    return this.campaignRepository.getAllCampaigns(organizationId);
  }
}
