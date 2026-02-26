import { ApiProperty } from '@nestjs/swagger';

export class VideoResponseDto {
  @ApiProperty({
    description:
      'URL de miniatura para renderizar la portada del video en cards/listados.',
    example: 'https://via.placeholder.com/300x200/282c34/61dafb?text=video',
  })
  thumbnail!: string;

  @ApiProperty({
    description: 'Titulo del video tal como se mostrara en el frontend.',
    example: 'NestJS en 10 minutos',
  })
  title!: string;

  @ApiProperty({
    description: 'Nombre del canal/autor del video.',
    example: 'Rankup Channel',
  })
  author!: string;

  @ApiProperty({
    description:
      'Fecha de publicacion transformada a formato relativo amigable.',
    example: 'Hace 2 meses',
  })
  publishedAt!: string;

  @ApiProperty({
    description:
      'Nivel de hype calculado por dominio. Formula base: (likes + comments) / views. Reglas: si title contiene "tutorial" => x2; si comments no existe => 0; si views = 0 => 0.',
    example: 0.42,
    minimum: 0,
  })
  hype!: number;
}
