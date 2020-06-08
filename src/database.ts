import { createConnection } from "typeorm";
import { DefaultNamingStrategy } from "typeorm/naming-strategy/DefaultNamingStrategy";
import { NamingStrategyInterface } from "typeorm/naming-strategy/NamingStrategyInterface";
import { snakeCase } from "typeorm/util/StringUtils";
import Page from "./pages/entity";
import User from "./users/entity";

/**
 * We want to use snake_case names in our database tables and columns,
 * but not in our models (they should be camelCase, because that's the convention in JavaScript/TypeScript code).
 * That's why we add a CustomNamingStrategy
 */
class CustomNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName) + "s";
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[]
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join("_")
    );
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}

export default function setupDatabase(): void {
  createConnection({
    type: "postgres",
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:1234@localhost:5432/postgres",
    entities: [Page, User],
    synchronize: false, // setting true will drop tables and recreate, so it shouldn't be set to true for the second time.
    logging: true,
    namingStrategy: new CustomNamingStrategy(),
  })
    .then(() => {
      console.log("Connected to Postgres Server with TypeORM");
    })
    .catch(console.error);
}
