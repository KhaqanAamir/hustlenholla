// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { PrismaService } from 'src/prisma_service/prisma.service';
// import { MailerService } from '@nestjs-modules/mailer';
// import { JwtService } from '@nestjs/jwt';
// import { HttpStatus } from '@nestjs/common';

// describe('AuthService', () => {
//     let authService: AuthService;
//     let prismaService: PrismaService;
//     let mailerService: MailerService;
//     let jwtService: JwtService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 AuthService,
//                 {
//                     provide: PrismaService,
//                     useValue: {
//                         getData: jest.fn(),
//                         postData: jest.fn(),
//                         updateData: jest.fn(),
//                     },
//                 },
//                 {
//                     provide: MailerService,
//                     useValue: {
//                         sendMail: jest.fn(),
//                     },
//                 },
//                 {
//                     provide: JwtService,
//                     useValue: {
//                         sign: jest.fn(),
//                     },
//                 },
//             ],
//         }).compile();

//         authService = module.get<AuthService>(AuthService);
//         prismaService = module.get<PrismaService>(PrismaService);
//         mailerService = module.get<MailerService>(MailerService);
//         jwtService = module.get<JwtService>(JwtService);
//     });

//     describe('signUp', () => {
//         it('should return success response when user is created', async () => {
//             const mockResponse = { email: 'test@example.com', password: 'password123', first_name: 'khaqan', last_name: 'aamir', role: 'SUPER_ADMIN' };
//             jest.spyOn(prismaService, 'postData').mockResolvedValue(mockResponse);

//             const result = await authService.signUp({ email: 'test@example.com', password: 'password123' });
//             expect(result.error).toBe(false);
//             expect(result.data).toHaveProperty('id');
//         });

//         it('should return error response when user creation fails', async () => {
//             const mockResponse = { error: true, msg: 'User creation failed' };
//             jest.spyOn(prismaService, 'postData').mockResolvedValue(mockResponse);

//             const result = await authService.signUp({ email: 'test@example.com', password: 'password123' });
//             expect(result.error).toBe(true);
//             expect(result.msg).toBe('User creation failed');
//         });

//         it('should throw an error when an exception occurs', async () => {
//             jest.spyOn(prismaService, 'postData').mockRejectedValue(new Error('Database error'));

//             const result = await authService.signUp({ email: 'test@example.com', password: 'password123' });
//             expect(result.error).toBe(true);
//             expect(result.msg).toContain('Inernal server error occured');
//         });
//     });

//     describe('signIn', () => {
//         it('should return success response when credentials are valid', async () => {
//             const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
//             jest.spyOn(prismaService, 'getData').mockResolvedValue({ error: false, data: mockUser });
//             jest.spyOn(authService, 'comparePassword').mockResolvedValue(true);

//             const result = await authService.signIn({ email: 'test@example.com', password: 'password123' });
//             expect(result.error).toBe(false);
//             expect(result.data).toHaveProperty('accessToken');
//         });

//         it('should return error response when credentials are invalid', async () => {
//             jest.spyOn(prismaService, 'getData').mockResolvedValue({ error: false, data: null });

//             const result = await authService.signIn({ email: 'test@example.com', password: 'wrongpassword' });
//             expect(result.error).toBe(true);
//             expect(result.msg).toBe('Invalid email or password');
//         });

//         it('should throw an error when an exception occurs', async () => {
//             jest.spyOn(prismaService, 'getData').mockRejectedValue(new Error('Database error'));

//             const result = await authService.signIn({ email: 'test@example.com', password: 'password123' });
//             expect(result.error).toBe(true);
//             expect(result.msg).toContain('Inernal server error occured');
//         });
//     });

//     // Add similar test cases for forgotPassword, verifyOtp, and resetPassword
// });