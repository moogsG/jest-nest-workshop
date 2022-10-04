import { Test } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('CatsController', () => {
    let catsController: CatsController;

    const results: Cat[] = [
        {
            age: 2,
            breed: 'Bombay',
            name: 'Pixel',
        },
    ];

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            controllers: [CatsController],
        })    .useMocker((token) => {
            if (token === CatsService) {
                return { findAll: jest.fn().mockResolvedValue(results) };
            }
            if (typeof token === 'function') {
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }
        })
            .compile();

        catsController = moduleRef.get<CatsController>(CatsController);
    });

    describe('findAll', () => {
        it('should return an array of cats', async () => {

            expect(await catsController.findAll()).toBe(results);
        });
    });
});