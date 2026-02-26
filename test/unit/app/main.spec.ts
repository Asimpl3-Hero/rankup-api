import { RequestMethod } from '@nestjs/common';

describe('main bootstrap', () => {
  const originalEnv = process.env;

  async function loadMainModule(): Promise<void> {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../../src/main');
    });

    await new Promise((resolve) => setImmediate(resolve));
  }

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
    jest.resetModules();
    jest.dontMock('@nestjs/core');
    jest.dontMock('@nestjs/swagger');
    jest.dontMock('../../../src/app.module');
  });

  it('boots with default settings and fallback port when PORT is invalid', async () => {
    process.env = { ...originalEnv, PORT: 'invalid-port' };

    const app = {
      setGlobalPrefix: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    const create = jest.fn().mockResolvedValue(app);
    const createDocument = jest.fn().mockReturnValue({ openapi: '3.0.0' });
    const setup = jest.fn();

    const builderChain = {
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      addTag: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({}),
    };
    const DocumentBuilder = jest
      .fn()
      .mockImplementation(() => builderChain);

    jest.doMock('@nestjs/core', () => ({
      NestFactory: { create },
    }));
    jest.doMock('@nestjs/swagger', () => ({
      DocumentBuilder,
      SwaggerModule: { createDocument, setup },
    }));
    jest.doMock('../../../src/app.module', () => ({
      AppModule: class AppModule {},
    }));

    await loadMainModule();

    expect(create).toHaveBeenCalledTimes(1);
    expect(app.setGlobalPrefix).toHaveBeenCalledWith('api', {
      exclude: [{ method: RequestMethod.GET, path: 'health' }],
    });
    expect(app.listen).toHaveBeenCalledWith(3000);
    expect(setup).toHaveBeenCalledWith('api/docs', app, { openapi: '3.0.0' });
    expect(builderChain.setTitle).toHaveBeenCalledWith('Rankup API');
    expect(builderChain.setDescription).toHaveBeenCalledWith(
      'API de videos con transformaciones para frontend',
    );
    expect(builderChain.setVersion).toHaveBeenCalledWith('1.0.0');
    expect(builderChain.addTag).toHaveBeenCalledTimes(2);
  });

  it('uses explicit environment values for port and swagger path', async () => {
    process.env = {
      ...originalEnv,
      PORT: '8081',
      SWAGGER_PATH: 'docs',
      SWAGGER_TITLE: 'Custom API',
      SWAGGER_DESCRIPTION: 'Custom description',
      SWAGGER_VERSION: '2.0.0',
    };

    const app = {
      setGlobalPrefix: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    const create = jest.fn().mockResolvedValue(app);
    const createDocument = jest.fn().mockReturnValue({ openapi: '3.0.0' });
    const setup = jest.fn();

    const builderChain = {
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      addTag: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({}),
    };
    const DocumentBuilder = jest
      .fn()
      .mockImplementation(() => builderChain);

    jest.doMock('@nestjs/core', () => ({
      NestFactory: { create },
    }));
    jest.doMock('@nestjs/swagger', () => ({
      DocumentBuilder,
      SwaggerModule: { createDocument, setup },
    }));
    jest.doMock('../../../src/app.module', () => ({
      AppModule: class AppModule {},
    }));

    await loadMainModule();

    expect(app.listen).toHaveBeenCalledWith(8081);
    expect(setup).toHaveBeenCalledWith('docs', app, { openapi: '3.0.0' });
    expect(builderChain.setTitle).toHaveBeenCalledWith('Custom API');
    expect(builderChain.setDescription).toHaveBeenCalledWith(
      'Custom description',
    );
    expect(builderChain.setVersion).toHaveBeenCalledWith('2.0.0');
  });
});
