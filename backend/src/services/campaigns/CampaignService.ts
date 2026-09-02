import { CampaignRepository } from '../../repositories/campaigns/CampaignRepository';

export interface CreateCampaignData {
  organizationId: string;
  name: string;
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED';
}

export class CampaignService {
  private campaignRepository: CampaignRepository;

  constructor() {
    this.campaignRepository = new CampaignRepository();
  }

  async createCampaign(data: CreateCampaignData) {
    const { organizationId, ...campaignData } = data;

    const prismaData = {
      ...campaignData,
      organization: {
        connect: {
          id: organizationId,
        },
      },
    };

    return this.campaignRepository.createCampaign(prismaData);
  }

  async getCampaign(id: string) {
    return this.campaignRepository.getCampaignById(id);
  }

  async getAllCampaigns(organizationId: string) {
    return this.campaignRepository.getAllCampaigns(organizationId);
  }
}