import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'finease-secret-123', // Hardcoded for simplicity per instructions
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAdminService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
