import { DataSource, EntityTarget, Repository } from 'typeorm';

// TODO: Se necesita implementar esto
export class BaseRepository<T> extends Repository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async findAll() {
    return this.find();
  }
}
