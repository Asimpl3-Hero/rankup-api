import { ApiProperty } from '@nestjs/swagger';

export class VideoResponseDto {
  @ApiProperty({
    description: 'URL de la miniatura del video',
    example: 'https://via.placeholder.com/300x200',
  })
  thumbnail!: string;

  @ApiProperty({
    description: 'Titulo del video',
    example: 'NestJS en 10 minutos',
  })
  title!: string;

  @ApiProperty({
    description: 'Nombre del autor o canal',
    example: 'MidudevFan',
  })
  author!: string;

  @ApiProperty({
    description: 'Fecha publicada en formato relativo amigable',
    example: 'Hace 2 meses',
  })
  publishedAt!: string;

  @ApiProperty({
    description: 'Score calculado con reglas de negocio',
    example: 0.42,
  })
  hype!: number;
}
