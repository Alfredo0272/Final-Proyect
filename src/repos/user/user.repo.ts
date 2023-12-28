export interface UserRepository<
  X extends { id: unknown },
  Y extends { id: unknown },
  Z extends { id: unknown }
> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  // eslint-disable-next-line no-unused-vars
  search({ key, value }: { key: keyof X; value: unknown }): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  delete(_id: X['id']): Promise<void>;
  addBeer(_beer: Y, _userId: X['id']): Promise<X>;
  addPub(_pub: Z, _userId: X['id']): Promise<X>;
  removeBeer(_beer: Y, _userId: X['id']): Promise<X>;
  removePub(_pub: Z, _userId: X['id']): Promise<X>;
}
