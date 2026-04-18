import { inngest } from './client';
import { runDigest } from '../lib/digest';

export const dailyDigestChecker = inngest.createFunction(
  {
    id: 'daily-digest-checker',
    triggers: [{ cron: '0 9 * * *' }],  // Run every morning at 9 AM UTC
  },
  async ({ step }) => {
    await step.run('send-digests', () => runDigest());
  }
);