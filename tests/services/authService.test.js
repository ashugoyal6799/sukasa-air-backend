const authService = require('../../src/services/authService');
const userRepository = require('../../src/repositories/userRepository');
const { generateToken } = require('../../src/utils/tokenUtil');

jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/utils/tokenUtil');

describe('Auth Service', () => {
  it('should log in a user and return a token', async () => {
    const mockUser = { _id: 'user-id-123', email: 'user@example.com' };
    userRepository.createUserIfNotExists.mockResolvedValue(mockUser);
    generateToken.mockReturnValue('mock-token');

    const token = await authService.login('user@example.com');

    expect(userRepository.createUserIfNotExists).toHaveBeenCalledWith('user@example.com');
    expect(generateToken).toHaveBeenCalledWith(mockUser);
    expect(token).toBe('mock-token');
  });

  it('should throw an error if user creation fails', async () => {
    userRepository.createUserIfNotExists.mockRejectedValue(new Error('User creation failed'));

    await expect(authService.login('user@example.com')).rejects.toThrow('User creation failed');
  });
});
