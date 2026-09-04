export function getErrorMessage(err: any, defaultMessage: string = 'An unexpected error occurred.'): string {
  const msg = err?.message || err?.toString() || defaultMessage;
  if (
    msg.includes('prisma') || 
    msg.includes('Prisma') || 
    msg.includes('Raw query failed') || 
    msg.includes('Server selection timeout') ||
    msg.includes('ECONNREFUSED')
  ) {
    return 'Database connection failed. Please ensure your current IP address is added to the MongoDB Atlas Network Access whitelist.';
  }
  return msg;
}
