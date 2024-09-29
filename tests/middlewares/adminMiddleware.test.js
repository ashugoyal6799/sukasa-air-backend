const adminMiddleware = require('../../src/middlewares/adminMiddleware');
const config = require('../../src/config');

describe('Admin Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { email: 'admin@example.com' }, traceId: 'trace-id-123' };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
    config.adminEmails = ['admin@example.com'];
  });

  it('should call next if the user is an admin', () => {
    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if the user is not an admin', () => {
    req.user.email = 'user@example.com';

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Access denied: Admins only.' });
  });

  it('should return 401 if no user information is found', () => {
    req.user = null;

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized: No user information found.' });
  });
});
