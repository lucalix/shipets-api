import Sequelize, { Model } from 'sequelize';

class PetImages extends Model {
  static init(sequelize) {
    super.init(
      {
        is_profile_image: Sequelize.BOOLEAN,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Pet, { foreignKey: 'pet_id', as: 'pet' });
    this.belongsTo(models.Breed, { foreignKey: 'file_id', as: 'images' });
  }
}

export default PetImages;
