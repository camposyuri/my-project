// Metheod up create a table in database
exports.up = async (knex) => {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNull();
    table.string("email").notNull().unique();
    table.string("password").notNull();
    table.boolean("admin").notNull().defaultTo("false");
  });
};
// Metheod down delete a table in database
// using rollback
exports.down = (knex) => {
  return knex.schema.dropTable("users");
};
