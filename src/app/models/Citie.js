import Sequelize, { Model } from 'sequelize';

class Citie extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        uf: Sequelize.STRING,
        ibge_code: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.State, { foreignKey: 'state_id', as: 'state' });
  }
}

export default Citie;
