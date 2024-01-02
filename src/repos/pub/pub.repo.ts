/* eslint-disable no-unused-vars */
export interface PubRepository<
  X extends { id: unknown },
  Y extends { id: unknown }
> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  search({ key, value }: { key: keyof X; value: unknown }): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  delete(id: X['id']): Promise<void>;
  addBeer(_beer: Y, _userId: X['id']): Promise<X>;
  removeBeer(_beer: Y, _userId: X['id']): Promise<X>;
}
