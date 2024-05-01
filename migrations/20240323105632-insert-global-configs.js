'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.bulkInsert('GlobalConfigs', [{
      key: 'origin_passphrase',
      value: 'origin_pass1234',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      key: 'edge_passphrase',
      value: 'edge_pass1234',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      key: 'origin_keyLength',
      value: '16',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      key: 'edge_keyLength',
      value: '16',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      key: 'origin_address',
      value: '209.38.176.82:10080',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      key: 'edge_address',
      value: '164.90.241.38:10081',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
        key: 'enable_test_session_id',
        value: 'true',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        key: 'test_session_id',
        value: '12345678-1234-1234-1234-123456789abc',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkDelete('GlobalConfigs', { key: 'passphrase' }, {});
  }
};
