import Sequelize, { Model } from 'sequelize';

class Pet extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        sex: Sequelize.STRING,
        date_birth: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.canceled_at === null ? 'active' : 'inactive';
          },
        },
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
    this.hasMany(models.PetImages, { foreignKey: 'id', as: 'petImages' });
  }
}

export default Pet;
