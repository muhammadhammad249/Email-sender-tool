import { LeadEnrichmentProvider, EnrichedLeadData } from './LeadEnrichmentProvider';

export class MockLeadEnrichmentProvider implements LeadEnrichmentProvider {
  readonly name = 'mock_enrichment';

  async enrichLead(email: string, domain?: string): Promise<EnrichedLeadData | null> {
    console.log(`[MockEnrichment] Enriching lead for email: ${email}, domain: ${domain}`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For demonstration, randomly decide if enrichment succeeds
    if (Math.random() > 0.2) {
      return {
        companySize: '50-200',
        industry: 'Software Development',
        location: 'San Francisco, CA',
        technologies: ['React', 'Node.js', 'PostgreSQL'],
        linkedInUrl: `https://linkedin.com/in/${email.split('@')[0]}`,
        confidenceScore: 90,
      };
    }

    return null; // No enrichment data found
  }
}
