export interface EnrichedLeadData {
  companySize?: string;
  industry?: string;
  location?: string;
  technologies?: string[];
  linkedInUrl?: string;
  confidenceScore: number;
}

export interface LeadEnrichmentProvider {
  /**
   * Identifies the enrichment provider (e.g., 'clearbit', 'apollo', 'mock')
   */
  readonly name: string;

  /**
   * Enrich a lead based on email and/or domain
   */
  enrichLead(email: string, domain?: string): Promise<EnrichedLeadData | null>;
}
