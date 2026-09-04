import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/AuthService';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { getErrorMessage } from '../../utils/errors';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, organizationName } = req.body;

      if (!firstName || !lastName || !email || !password || !organizationName) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }

      const result = await authService.register({ firstName, lastName, email, password, organizationName });
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: getErrorMessage(err, 'Registration failed.') });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const result = await authService.login({ email, password });
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ message: getErrorMessage(err, 'Login failed.') });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
      }

      const result = await authService.verifyOTP({ email, otp });
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: getErrorMessage(err, 'Verification failed.') });
    }
  }

  async resend(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email is required.' });
      const result = await authService.resendOTP(email);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: getErrorMessage(err, 'Failed to resend code.') });
    }
  }

  async me(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await authService.getMe(userId);
      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(404).json({ message: getErrorMessage(err, 'User not found.') });
    }
  }
}
