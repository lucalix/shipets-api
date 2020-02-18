module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('pets', 'sex', {
      type: Sequelize.STRING,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('pets', 'sex');
  },
};
