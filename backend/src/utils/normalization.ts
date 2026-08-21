/**
 * Data Normalization Pipeline for Leads
 */

export class NormalizationPipeline {
  /**
   * Normalizes an email address
   * - Lowercases
   * - Trims whitespace
   */
  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Normalizes a name
   * - Trims whitespace
   * - Capitalizes first letter of each word (Title Case)
   */
  static normalizeName(name: string): string {
    if (!name) return name;
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Normalizes a URL/Domain
   * - Removes http:// or https://
   * - Removes www.
   * - Removes trailing slashes
   * - Lowercases
   */
  static normalizeDomain(url: string): string {
    if (!url) return url;
    let domain = url.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '');
    domain = domain.replace(/^www\./, '');
    domain = domain.replace(/\/$/, '');
    // If there's still a path, just take the domain part
    domain = domain.split('/')[0];
    return domain;
  }

  /**
   * Normalizes a company name
   * - Trims whitespace
   * - Removes common suffixes like "Inc.", "LLC", etc. if desired (optional)
   */
  static normalizeCompanyName(company: string): string {
    if (!company) return company;
    // Basic trim and replace multiple spaces with single space
    return company.trim().replace(/\s+/g, ' ');
  }
}
