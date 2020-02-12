import Sequelize, { Model } from 'sequelize';

class Breed extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Specie, { foreignKey: 'specie_id', as: 'specie' });
  }
}

export default Breed;
