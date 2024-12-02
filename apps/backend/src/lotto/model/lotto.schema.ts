import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InningDocument = Inning & Document;

@Schema()
export class Inning {
  @Prop({ required: true })
  inningId: number;

  @Prop({ type: [{ memberId: Number, sequence: Number, createAt: Date }] })
  logs: { memberId: number; sequence: number; createAt: Date }[];

  // 모델 이름 정의 (필수)
  @Prop({ required: true })
  name: string;
}

export const InningSchema = SchemaFactory.createForClass(Inning);
