import { Router } from 'express';

const router = Router();

router.post('/warmup', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ status: 'ERROR', message: 'Email is required' });
  }

  console.log(`[EmailAccounts] Warmup requested for ${email}`);
  
  // Simulate backend processing (e.g. queueing warmup jobs, interacting with provider)
  setTimeout(() => {
    console.log(`[EmailAccounts] Warmup successfully initiated for ${email}`);
    res.status(200).json({ 
      status: 'SUCCESS', 
      message: `Warmup process initiated for ${email}`
    });
  }, 1500);
});

export default router;
