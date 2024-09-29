const User = require('../../src/models/User');
const userRepository = require('../../src/repositories/userRepository');

jest.mock('../../src/models/User');

describe('User Repository', () => {
  it('should find a user by email', async () => {
    const mockUser = { _id: 'user-id-123', email: 'user@example.com' };
    User.findOne.mockResolvedValue(mockUser);

    const user = await userRepository.findByEmail('user@example.com');

    expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(user).toEqual(mockUser);
  });

  it('should create a new user if not exists', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'user-id-123', email: 'user@example.com' });

    const user = await userRepository.createUserIfNotExists('user@example.com');

    expect(User.create).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(user).toEqual({ _id: 'user-id-123', email: 'user@example.com' });
  });
});
