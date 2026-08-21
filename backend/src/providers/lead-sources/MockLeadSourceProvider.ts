import { LeadSourceProvider, LeadSourceSearchCriteria, DiscoveredLead } from './LeadSourceProvider';

export class MockLeadSourceProvider implements LeadSourceProvider {
  readonly name = 'mock';

  async searchLeads(criteria: LeadSourceSearchCriteria): Promise<DiscoveredLead[]> {
    console.log(`[MockProvider] Searching leads with criteria:`, criteria);
    // Return dummy data for testing
    const count = criteria.limit || 5;
    const leads: DiscoveredLead[] = [];
    for (let i = 0; i < count; i++) {
      leads.push({
        firstName: `John${i}`,
        lastName: `Doe${i}`,
        email: `john.doe${i}@example.com`,
        companyName: `Test Company ${i}`,
        jobTitle: criteria.jobTitle || 'Developer',
        source: this.name,
      });
    }
    return leads;
  }

  async discoverEmailsForDomain(domain: string): Promise<DiscoveredLead[]> {
    console.log(`[MockProvider] Discovering emails for domain:`, domain);
    return [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        email: `alice@${domain}`,
        companyName: domain,
        source: this.name,
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: `bob@${domain}`,
        companyName: domain,
        source: this.name,
      }
    ];
  }
}
