import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { OrdersModule } from './orders/orders.module';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_SERVER,
        port: 465,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          password: process.env.MAIL_PASSWORD
        },
      },
      defaults: {
        from: 'Hustle-N-Hola'
      },
      template: {
        dir: (() => {
          return path.join(process.cwd() + '/templates');
        })(),
        adapter: new HandlebarsAdapter(undefined, { inlineCssEnabled: true }),
        options: {
          strict: true
        }
      }
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    AuthModule,
    SupabaseModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
