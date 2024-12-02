import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChartDocument = Chart & Document;

@Schema()
export class Chart {
  @Prop({ required: true })
  cropData: string;

  @Prop({ type: [{ x: Date, y: Number }] })
  column: { x: Date; y: number }[];

  @Prop({ required: true })
  name: string;
}

export const ChartSchema = SchemaFactory.createForClass(Chart);
