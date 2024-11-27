import { DatabaseService } from '../../common/database.service';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserRepository {
  constructor(private readonly pool: DatabaseService) {}
  async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await this.pool.query(query, [username]);
    return result.rows[0];
  }
  async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
  async create(user: User): Promise<void> {
    const query = `INSERT INTO users (id, name, username, password) VALUES ($1, $2, $3,$4)`;
    const values = [user.id, user.name, user.username, user.password];
    await this.pool.query(query, values);
  }
}
