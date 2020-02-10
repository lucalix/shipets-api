import Sequelize, { Model } from 'sequelize';

class State extends Model {
  static init(sequelize) {
    super.init(
      {
        uf_code: Sequelize.INTEGER,
        uf: Sequelize.STRING,
        name: Sequelize.STRING,
        region: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default State;
