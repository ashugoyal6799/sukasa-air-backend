// tests/controllers/authController.test.js

const { login } = require('../../src/controllers/authController');
const authService = require('../../src/services/authService');

jest.mock('../../src/services/authService'); // Mock authService

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { emailId: 'user@example.com' },
      traceId: 'trace-id-123',
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should return a token on successful login', async () => {
    authService.login.mockResolvedValue('mock-token'); // Mock login service to return a token

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, token: 'mock-token' });
  });

  it('should return 400 if email is missing', async () => {
    req.body = {}; // No email in request body

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Missing required field: emailId.',
    });
  });
});
