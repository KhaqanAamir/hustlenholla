import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { OrdersModule } from './orders/orders.module';
import { join } from 'path';
import { PrismaModule } from './prisma_service/prisma.module';
import { CuttingModule } from './work-flow/cutting/cutting.module';
import { StitchingModule } from './work-flow/stitching/stitching.module';
import { SupportModule } from './support/support.module';
import { WashingModule } from './work-flow/washing/washing.module';
import { FinishingModule } from './work-flow/finishing/finishing.module';
import { DispatchModule } from './work-flow/dispatching/dispatch.module';
import { PackagingModule } from './work-flow/packaging/packaging.module';
import { FabricInspectionModule } from './fabric-inspection/inspection.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StoreModule } from './store/store.module';
import { WorkOrdersModule } from './orders/work-orders/work-orders.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_SERVER,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        },
        connectionTimeout: 10000,
      },
      defaults: {
        from: 'Hustle-N-Hola'
      },
      template: {
        dir: (() => {
          return join(process.cwd() + '/templates');
        })(),
        adapter: new HandlebarsAdapter(undefined, { inlineCssEnabled: true }),
        options: {
          strict: true
        }
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    SupabaseModule,
    OrdersModule,
    PrismaModule,
    CuttingModule,
    StitchingModule,
    SupportModule,
    WashingModule,
    FinishingModule,
    DispatchModule,
    PackagingModule,
    FabricInspectionModule,
    StoreModule,
    WorkOrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor(
    private readonly mailService: MailerService,
  ) { }

  async testEmail() {
    try {
      await this.mailService.sendMail({
        to: 'khaqanaamir92@gmail.com',
        subject: 'Test Email',
        template: 'forgot-password',
        context: {
          forgotPasswordOtp: 123432
        }
      })

      console.log('Email sent successfully');
    }

    catch (e) {
      console.log('Error sending email:', e);
    }

  }

  async onModuleInit() {
    // await this.testEmail();
  }
}
