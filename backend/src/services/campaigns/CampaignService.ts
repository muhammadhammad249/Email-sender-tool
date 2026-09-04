import { CampaignRepository } from '../../repositories/campaigns/CampaignRepository';

export interface CreateCampaignData {
  organizationId: string;

  name: string;

  status:
  | 'DRAFT'
  | 'SCHEDULED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'PAUSED';
}

export class CampaignService {
  private campaignRepository: CampaignRepository;

  constructor() {
    this.campaignRepository = new CampaignRepository();
  }

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignData) {
    const { organizationId, name, status } = data;

    return this.campaignRepository.createCampaign({
      name,
      status,

      organization: {
        connect: {
          id: organizationId,
        },
      },
    });
  }

  /**
   * Get campaign by ID
   */
  async getCampaign(id: string) {
    return this.campaignRepository.getCampaignById(id);
  }

  /**
   * Get all campaigns for an organization
   */
  async getAllCampaigns(organizationId: string) {
    return this.campaignRepository.getAllCampaigns(organizationId);
  }
}