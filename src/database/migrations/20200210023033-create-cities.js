module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'states', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      uf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ibge_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('cities');
  },
};
