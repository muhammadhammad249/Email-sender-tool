import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: '../database/prisma/schema.prisma',
  datasource: {
    url: 'file:../database/prisma/dev.db',
  },
});
