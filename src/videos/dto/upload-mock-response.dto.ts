import { ApiProperty } from '@nestjs/swagger';

export class UploadMockResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmacion de carga del mock.',
    example: 'Mock uploaded successfully.',
  })
  message!: string;

  @ApiProperty({
    description: 'Cantidad de items disponibles en el nuevo mock cargado.',
    example: 12,
    minimum: 0,
  })
  itemsCount!: number;
}
