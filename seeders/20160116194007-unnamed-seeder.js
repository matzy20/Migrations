'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        first_name: 'Gail',
        last_name: 'Matsushima',
        bio: 'Gail loves coffee sports and people, in that order',
        //email is no longer a string, removed validate
        email: 'notTelling@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Michael',
        last_name: 'Jordan',
        bio: 'Should not have played baseball',
        email:'mrBasketball@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
