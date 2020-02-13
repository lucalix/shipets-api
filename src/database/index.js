import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import State from '../app/models/State';
import Citie from '../app/models/Citie';
import Specie from '../app/models/Specie';
import Breed from '../app/models/Breed';
import Pet from '../app/models/Pet';
import PetImages from '../app/models/PetImages';

import databaseConfig from '../config/database';

const models = [User, File, State, Citie, Specie, Breed, Pet, PetImages];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
