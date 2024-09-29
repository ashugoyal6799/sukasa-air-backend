const traceMiddleware = require('../../src/middlewares/traceMiddleware');
const { v4: uuidv4 } = require('uuid');

jest.mock('uuid');

describe('Trace Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      setHeader: jest.fn(),
    };
    next = jest.fn();
    uuidv4.mockReturnValue('mock-trace-id');
  });

  it('should generate and attach a trace ID to the request object', () => {
    traceMiddleware(req, res, next);

    expect(req.traceId).toBe('mock-trace-id');
    expect(res.setHeader).toHaveBeenCalledWith('X-Trace-Id', 'mock-trace-id');
    expect(next).toHaveBeenCalled();
  });
});
