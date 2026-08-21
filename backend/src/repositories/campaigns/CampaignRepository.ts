import { getPrisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class CampaignRepository {
  private get prisma() {
    return getPrisma();
  }

  async createCampaign(data: Prisma.CampaignCreateInput) {
    return this.prisma.campaign.create({ data });
  }

  async getCampaignById(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        steps: true,
      },
    });
  }

  async getAllCampaigns(organizationId: string) {
    return this.prisma.campaign.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCampaign(id: string, data: Prisma.CampaignUpdateInput) {
    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }
}
