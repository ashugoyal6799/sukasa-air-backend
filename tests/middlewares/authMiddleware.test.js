// tests/authMiddleware.test.js

const authMiddleware = require('../../src/middlewares/authMiddleware');
const { verifyToken } = require('../../src/utils/tokenUtil');

jest.mock('../../src/utils/tokenUtil'); // Mock the verifyToken function

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn().mockReturnValue('Bearer mockToken') }; // Mock request with a token
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if token is valid', () => {
    verifyToken.mockReturnValue({ email: 'user@example.com' }); // Mock valid token

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ email: 'user@example.com' }); // Check if user is set in req
    expect(next).toHaveBeenCalled(); // Ensure next() is called
  });

  it('should return 401 if token is invalid', () => {
    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token.' });
  });

  it('should return 401 if no token is provided', () => {
    req.header.mockReturnValueOnce(null); // Mock no Authorization header

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Access denied. No token provided.' });
  });
});
