// mongodb.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://saharshpatel24:Developer2453@cluster0.fkmbhte.mongodb.net/AstroAlgorithm?retryWrites=true&w=majority',
    ),
  ],
})
export class MongoDBModule {}
