import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { IsString, Length, MinLength } from "class-validator";

// model class (entity) describes table.
// each instance of the model class (entity instance) represents a row in a table.
@Entity()
export default class Page extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Length(5, 25)
  @Column("text", { nullable: false })
  title: string = "";

  @IsString()
  @MinLength(10)
  @Column("text", { nullable: false })
  content: string = "";
}
