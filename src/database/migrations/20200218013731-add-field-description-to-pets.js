module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('pets', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('pets', 'description');
  },
};
