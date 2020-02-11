import State from '../models/State';

class StatesController {
  async index(req, res) {
    const states = await State.findAll({
      attributes: ['id', 'name', 'uf'],
    });

    return res.json(states);
  }
}

export default new StatesController();
