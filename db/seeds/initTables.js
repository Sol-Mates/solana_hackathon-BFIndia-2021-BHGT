const tableNames = require("../../src/shared/constants/dbtables.js").tableNames

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex(tableNames.USER).del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.UNIQUE_CODE).del()
        .then(async function () {
          // Inserts seed entries
          await knex(tableNames.UNIQUE_CODE).insert([
            {uniqueCode:"ARXYU234",isActive: true},
            {uniqueCode:"ARXYU235",isActive: true},
            {uniqueCode:"ARXYU236",isActive: true},
            {uniqueCode:"ARXYU237",isActive: true},
            {uniqueCode:"ARXYU238",isActive: true}
          ]);
        return knex(tableNames.USER).insert([
          {name: "admin", email: 'admin@admin.com', password:'password', isActive: true, username:'admin'},
        ]);
      });
    });

  
};
