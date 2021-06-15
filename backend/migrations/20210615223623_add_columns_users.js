exports.up = async (knex) => {
  return knex.schema.alterTable("users", (table) => {
    table.timestamp("deletedAt");
  });
};

exports.down = async (knex) => {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("deletedAt");
  });
};
