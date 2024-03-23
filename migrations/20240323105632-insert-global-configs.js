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
      value: 'origin_pass',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      key: 'edge_passphrase',
      value: 'edge_pass',
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
