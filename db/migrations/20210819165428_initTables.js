const tableNames = require("../../src/shared/constants/dbtables.js").tableNames
const UNIQUE_CODE_LENGTH = 8
exports.up = function (knex) {
   return knex.schema
   //user
   .createTable(tableNames.USER, (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('gender',25);
      table.string('age',25);
      table.string('email', 255).unique().notNullable();
      table.string('username', 255).unique().notNullable();
      table.string('password',255).notNullable();
      table.boolean('isActive').notNullable();
      table.timestamps(true, true)
   })

   //certificateType
   .createTable(tableNames.CERTIFICATE_TYPE, (table) => {
      table.increments('id');
      table.integer('certificateType', 100).unique().notNullable();
      table.timestamps(true, true)
   })

   //uniqueCode
   .createTable(tableNames.UNIQUE_CODE, (table) => {
      table.increments('id');
      table.string('uniqueCode', UNIQUE_CODE_LENGTH).unique().notNullable();
      table.boolean('isActive').notNullable();
      table.timestamps(true, true)
   })

   //coupleInfo
   .createTable(tableNames.COUPLE_INFO, (table) => {
      table.increments('id');
      table.integer('first_partner').unsigned().references("id").inTable(tableNames.USER).index().notNullable();
      table.integer('second_partner').unsigned().references("id").inTable(tableNames.USER).index();
      table.string('coupleId', UNIQUE_CODE_LENGTH).references("uniqueCode").inTable(tableNames.UNIQUE_CODE).index().notNullable();
      table.integer('stakeCurrencyCount');
      table.string('stakeCurrencyName',100);
      table.string('stakeCurrencyWalletAddress',100);
      table.boolean('isActive');
      table.timestamps(true, true)
   })

   //coupleCurrencyInfo
   .createTable(tableNames.COUPLE_CURRENCY_INFO, (table) => {
      table.increments('id');
      table.string('coupleId', UNIQUE_CODE_LENGTH).references("coupleId").inTable(tableNames.COUPLE_INFO).index().notNullable();
      table.integer('userId').unsigned().references("id").inTable(tableNames.USER).index().notNullable();
      table.integer('currency_stake_count');
      table.integer('currency_share_percentage');
      table.string('currency_wallet_address',100);
      table.boolean('isLatest');
      table.timestamps(true, true)
   })
   
   //currencyEconomics
   .createTable(tableNames.CURRENCY_ECONOMICS, (table) => {
      table.increments('id');
      table.string('coupleId', UNIQUE_CODE_LENGTH).references("coupleId").inTable(tableNames.COUPLE_INFO).index().notNullable();
      table.integer('initialCurrencyCount');
      table.integer('currencyReleased');
      table.integer('currencyReceived');
      table.integer('finalCurrencyCount');
      table.timestamps(true, true)
   })

   //certificateInfo
   .createTable(tableNames.CERTIFICATE_INFO, (table) => {
      table.increments('id');
      table.string('coupleId', UNIQUE_CODE_LENGTH).references("coupleId").inTable(tableNames.COUPLE_INFO).index().notNullable();

      table.string('valuesOnCertificate',500); //array of strings which can be referred sequentially in the chosen template's placeholders
      
      table.integer('certificateType').unsigned().references("id").inTable(tableNames.CERTIFICATE_TYPE).index().notNullable();
      table.string('certificateNumber',200);
      table.string('certificateTemplate',5000); //can be Id from IPFS or template htmlcoded string
      
      table.boolean('isActive').notNullable();
      table.timestamps(true, true)
   })
   //location
   .createTable(tableNames.LOCATION, (table) => {
      table.increments('id');
      table.string('latitude', 255).notNullable();
      table.string('longitude', 255).notNullable();
      table.string('localityName', 255).notNullable();
      table.string('city', 100).notNullable();
      table.string('address', 255).notNullable();
      table.string('address2', 255).notNullable();
      table.string('street', 255);
      table.integer('pinCode').notNullable();
      table.string('state', 100).notNullable();
      table.string('country', 100).notNullable();
      table.timestamps(true, true)
   })
 .then((result)=>{
      console.log(result,'All tables created')
   }).catch((error)=>{
      console.log(error)
   })

};

exports.down = function (knex) {
   return knex.schema
   .dropTable(tableNames.CERTIFICATE_INFO)
   .dropTable(tableNames.CERTIFICATE_TYPE)
   .dropTable(tableNames.CURRENCY_ECONOMICS)
   .dropTable(tableNames.COUPLE_CURRENCY_INFO)
   .dropTable(tableNames.COUPLE_INFO)
   .dropTable(tableNames.UNIQUE_CODE)
   .dropTable(tableNames.USER)
   .dropTable(tableNames.LOCATION)
};

exports.config = { transaction: false };