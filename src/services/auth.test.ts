import { HttpError } from '../types/http.error.js';
import { Auth } from './auth.js';
import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { TokenPayload } from '../types/token.payload.js';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Given the Auth class', () => {
  describe('When I use createJWT method', () => {
    test('Then the JWT sign method should be called', () => {
      const mockPayload = {} as TokenPayload;
      Auth.signJWT(mockPayload);
      expect(jwt.sign).toHaveBeenCalled();
    });

    test('When I use verifJWTGettingPayload method', () => {
      const mockToken = 'token';
      Auth.verifyAndGetPayload(mockToken);
      expect(jwt.verify).toHaveBeenCalled();
    });

    test('When the result of the jwt.verify function returns a string and gives an error', () => {
      const mockResult = '';
      const mockToken = 'token';
      const error = new HttpError(498, 'Invalid Token', mockResult);
      const mockVerify = (jwt.verify as jest.Mock).mockReturnValueOnce(
        mockResult
      );
      expect(() => Auth.verifyAndGetPayload(mockToken)).toThrow(error);
      expect(mockVerify).toHaveBeenCalled();
    });

    test('When I use hash method', async () => {
      const mockValue = 'password';
      const mockHashedValue = 'hashedPassword';
      (hash as jest.Mock).mockResolvedValueOnce(mockHashedValue);

      const result = await Auth.hash(mockValue);

      expect(hash).toHaveBeenCalled();
      expect(result).toBe(mockHashedValue);
    });

    test('When I use compare method', async () => {
      const mockValue = 'password';
      const mockHashedValue = 'hashedPassword';
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await Auth.compare(mockValue, mockHashedValue);

      expect(compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
