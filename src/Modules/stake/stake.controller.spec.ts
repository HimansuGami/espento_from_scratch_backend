import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { StakeController } from './stake.controller';
import { StakeService } from './stake.service';

describe('StakeController', () => {
  let controller: StakeController;
  let service: StakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StakeController],
      providers: [
        StakeService,
        {
          provide: getModelToken('stakeledger'),
          useValue: {},
        },
        {
          provide: getModelToken('stakerewardledger'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<StakeController>(StakeController);
    service = module.get<StakeService>(StakeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addStake', () => {
    it('should call service method with correct arguments', async () => {
      const mockRequest = {
        amount: 100,
        user_address: 'test_user_address',
        stake_apr: 5,
        stake_type: 'test_stake_type',
        time_tenure: 365,
      };
      const mockResponse = {
        data: {
          user_address: 'test_user_address',
          hash: 'test_hash',
          total_expected_amount: 1000,
          total_claimed_amount: 0,
          total_remaining_amount: 1000,
          stake_type: 'test_stake_type',
          stake_apr: 5,
        },
        message: 'stake created successfully',
        statusCode: 200,
      };

      jest.spyOn(service, 'addStakeAsync').mockResolvedValue(mockResponse);

      const result = await controller.addStake(mockRequest);
      console.log({ result });

      expect(service.addStakeAsync).toHaveBeenCalledWith(
        mockRequest.amount,
        mockRequest.user_address,
        mockRequest.stake_apr,
        mockRequest.stake_type,
        mockRequest.time_tenure,
      );
      expect(result).toEqual(mockResponse);
    });

    // it('should return an error when user address is missing', async () => {
    //   const mockRequest = {
    //     amount: 100,
    //     stake_apr: 5,
    //     stake_type: 'test_stake_type',
    //     time_tenure: 365,
    //   };
    //   //@ts-ignore
    //   const result = await controller.addStake(mockRequest);

    //   expect(service.addStakeAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400);
    //   expect(result.message).toContain('user_address');
    // });

    // it('should return an error for invalid stake amount', async () => {
    //   const mockRequest = {
    //     amount: 0,
    //     user_address: 'test_user_address',
    //     stake_apr: 5,
    //     stake_type: 'test_stake_type',
    //     time_tenure: 365,
    //   };

    //   const result = await controller.addStake(mockRequest);

    //   expect(service.addStakeAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400);
    //   expect(result.message).toContain('amount');
    // });
  });

  describe('stakeClaim', () => {
    it('should call service method with correct arguments', async () => {
      const mockRequest = {
        amount: 50,
        user_address: 'test_user_address',
        hash: 'test_hash',
      };
      const mockResponse = {
        data: {
          user_address: 'test_user_address',
          total_claimed_amount: 100,
          last_claimed_at: new Date(),
          claimed_amount: 50,
        },
        message: 'stake claimed successfully',
        statusCode: 200,
      };

      jest.spyOn(service, 'stakeClaimAsync').mockResolvedValue(mockResponse);

      const result = await controller.stakeClaim(mockRequest);
      expect(service.stakeClaimAsync).toHaveBeenCalledWith(
        mockRequest.user_address,
        mockRequest.amount,
        mockRequest.hash,
      );
      expect(result).toEqual(mockResponse);
    });

    // it('should return an error when user address is missing', async () => {
    //   const mockRequest = {
    //     amount: 50,
    //     hash: 'test_hash',
    //   };
    // //@ts-ignore
    //   const result = await controller.stakeClaim(mockRequest);

    //   expect(service.stakeClaimAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400); // Assuming 400 is the status code for bad request
    //   expect(result.message).toContain('user_address');
    // });

    // it('should return an error for invalid stake amount', async () => {
    //   const mockRequest = {
    //     amount: 0, // Zero amount
    //     user_address: 'test_user_address',
    //     hash: 'test_hash',
    //   };

    //   const result = await controller.stakeClaim(mockRequest);

    //   expect(service.stakeClaimAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400); // Assuming 400 is the status code for bad request
    //   expect(result.message).toContain('amount');
    // });
  });

  describe('stakeClaimAll', () => {
    it('should call service method with correct arguments', async () => {
      const mockRequest = {
        user_address: 'test_user_address',
        record: [
          { hash: 'test_hash_1', amount: 50 },
          { hash: 'test_hash_2', amount: 100 },
        ],
      };
      const mockResponse = {
        data: {
          user_address: 'test_user_address',
          total_claimed_amount: 500, // Adjust this according to your test scenario
          data: [
            { claimed_amount: 100, hash: 'hash_1' },
            { claimed_amount: 200, hash: 'hash_2' },
            { claimed_amount: 200, hash: 'hash_3' },
          ],
        },
        message: 'stake claimed successfully',
        statusCode: 200,
      };

      jest.spyOn(service, 'stakeClaimAllAsync').mockResolvedValue(mockResponse);

      const result = await controller.stakeClaimAll(mockRequest);
      console.log({ result, data_1: result.data.data });

      expect(service.stakeClaimAllAsync).toHaveBeenCalledWith(
        mockRequest.user_address,
        mockRequest.record,
      );
      expect(result).toEqual(mockResponse);
    });

    // it('should return an error when user address is missing', async () => {
    //   const mockRequest = {
    //     record: [
    //       { hash: 'test_hash_1', amount: 50 },
    //       { hash: 'test_hash_2', amount: 100 },
    //     ],
    //   };
    //   //@ts-ignore
    //   const result = await controller.stakeClaimAll(mockRequest);

    //   expect(service.stakeClaimAllAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400); // Assuming 400 is the status code for bad request
    //   expect(result.message).toContain('user_address');
    // });

    // it('should return an error when record array is empty', async () => {
    //   const mockRequest = {
    //     user_address: 'test_user_address',
    //     record: [],
    //   };

    //   const result = await controller.stakeClaimAll(mockRequest);

    //   expect(service.stakeClaimAllAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400); // Assuming 400 is the status code for bad request
    //   expect(result.message).toContain('record');
    // });
  });

  describe('stakeClaimActual', () => {
    it('should call service method with correct arguments', async () => {
      const mockRequest = {
        user_address: 'test_user_address',
        record: [{ hash: 'test_hash_1' }, { hash: 'test_hash_2' }],
      };
      const mockResponse = {
        data: {
          user_address: 'test_user_address',
          total_claimed_amount: 500,
          data: [
            { claimed_amount: 100, hash: 'hash_1', time_difference: 10 },
            { claimed_amount: 200, hash: 'hash_2', time_difference: 20 },
            { claimed_amount: 200, hash: 'hash_3', time_difference: 30 },
          ],
        },
        message: 'stake claimed successfully',
        statusCode: 200,
      };

      jest.spyOn(service, 'stakeClaimActual').mockResolvedValue(mockResponse);

      const result = await controller.stakeClaimActual(mockRequest);
      expect(service.stakeClaimActual).toHaveBeenCalledWith(
        mockRequest.user_address,
        mockRequest.record,
      );
      expect(result).toEqual(mockResponse);
    });

    // it('should return an error when record array is empty', async () => {
    //   const mockRequest = {
    //     user_address: 'test_user_address',
    //     record: [],
    //   };

    //   const result = await controller.stakeClaimAll(mockRequest);

    //   expect(service.stakeClaimAllAsync).not.toHaveBeenCalled();
    //   expect(result.statusCode).toEqual(400);
    //   expect(result.message).toContain('record');
    // });
  });
});
