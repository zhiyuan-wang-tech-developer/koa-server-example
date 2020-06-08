import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { IsString, MinLength, IsEmail } from "class-validator";
import { Exclude } from "class-transformer";
import * as bcrypt from "bcrypt";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @MinLength(2)
  @Column("text", { nullable: false })
  firstName: string = "";

  @IsString()
  @MinLength(2)
  @Column("text", { nullable: false })
  lastName: string = "";

  @IsEmail()
  @Column("text", { nullable: false })
  email: string = "";

  @IsString()
  @MinLength(3)
  @Column("text", { nullable: false })
  city: string = "";

  /**
   * add the @Exclude decorator from the class-transformer package
   * so that the password will not be shown if we return a user JSON object via our API.
   */
  @IsString()
  @MinLength(8)
  @Column("text", { nullable: true }) // If { nullable: false }, Postgres cannot add this column while the old users without password are still there.
  @Exclude({ toPlainOnly: true })
  password: string = ""; // here stores the hashed password.

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10); // bcrypt will go through 2^10 iterations of processing.
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
