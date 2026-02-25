import { ApiProperty } from '@nestjs/swagger';

export class VideoResponseDto {
  @ApiProperty({ example: 'https://via.placeholder.com/300x200' })
  thumbnail!: string;

  @ApiProperty({ example: 'NestJS en 10 minutos' })
  title!: string;

  @ApiProperty({ example: 'MidudevFan' })
  author!: string;

  @ApiProperty({ example: 'Hace 2 meses' })
  publishedAt!: string;

  @ApiProperty({ example: 0.42 })
  hype!: number;
}
