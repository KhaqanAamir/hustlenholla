import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            forgotPassword: jest.fn(),
            verifyOtp: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should return success response when signUp is successful', async () => {
      const mockResponse = { error: false, msg: 'User signed up successfully' };
      jest.spyOn(authService, 'signUp').mockResolvedValue(mockResponse);

      const result = await authController.signUp({ email: 'test@example.com', password: 'password123', first_name: 'khaqan', last_name: 'aamir', role: 'SUPER_ADMIN' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when signUp fails', async () => {
      const mockResponse = { error: true, msg: 'Sign up failed' };
      jest.spyOn(authService, 'signUp').mockResolvedValue(mockResponse);

      await expect(authController.signUp({ email: 'test@example.com', password: 'password123', first_name: 'khaqan', last_name: 'aamir', role: 'SUPER_ADMIN' }))
        .rejects.toThrow(new HttpException(mockResponse.msg, HttpStatus.BAD_REQUEST));
    });

    it('should throw an error when invalid data is provided', async () => {
      jest.spyOn(authService, 'signUp').mockResolvedValue(null);

      await expect(authController.signUp({ email: 'test@example.com', password: 'password123', first_name: 'khaqan', last_name: 'aamir', role: 'SUPER_ADMIN' }))
        .rejects.toThrow(HttpException);
    });
  });

  describe('signIn', () => {
    it('should return success response when signIn is successful', async () => {
      const mockResponse = { error: false, msg: 'User signed in successfully' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockResponse);

      const result = await authController.signIn({ email: 'test@example.com', password: 'password123' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when signIn fails', async () => {
      const mockResponse = { error: true, msg: 'Invalid email or password' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockResponse);

      await expect(authController.signIn({ email: 'test@example.com', password: 'wrongpassword' }))
        .rejects.toThrow(new HttpException(mockResponse.msg, HttpStatus.BAD_REQUEST));
    });

    it('should throw an error when invalid data is provided', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue(null);

      await expect(authController.signIn({ email: '', password: '' }))
        .rejects.toThrow(HttpException);
    });
  });

  // Add similar test cases for forgotPassword, verifyOtp, and resetPassword
});