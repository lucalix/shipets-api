import Sequelize, { Model } from 'sequelize';

class Breed extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        date_birth: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Breed, { foreignKey: 'breed_id', as: 'breed' });
    this.belongsTo(models.Citie, { foreignKey: 'citie_id', as: 'citie' });
  }
}

export default Breed;
