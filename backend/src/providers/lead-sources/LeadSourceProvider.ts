export interface DiscoveredLead {
  firstName?: string;
  lastName?: string;
  email: string;
  companyName?: string;
  jobTitle?: string;
  domain?: string;
  location?: string;
  source: string;
}

export interface LeadSourceSearchCriteria {
  industry?: string;
  jobTitle?: string;
  companySize?: string;
  location?: string;
  limit?: number;
}

export interface LeadSourceProvider {
  /**
   * Identifies the provider (e.g., 'apollo', 'hunter', 'mock')
   */
  readonly name: string;

  /**
   * Search for leads based on specific criteria
   */
  searchLeads(criteria: LeadSourceSearchCriteria): Promise<DiscoveredLead[]>;
  
  /**
   * Discover emails for a specific domain
   */
  discoverEmailsForDomain(domain: string): Promise<DiscoveredLead[]>;
}
