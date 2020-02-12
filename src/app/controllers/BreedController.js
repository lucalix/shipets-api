import Breed from '../models/Breed';
import Specie from '../models/Specie';

class BreedController {
  async index(req, res) {
    const { specie_id } = req.query;

    let filters = {
      canceled_at: null,
    };

    if (specie_id) {
      filters = { ...filters, specie_id };
    }

    const breeds = await Breed.findAll({
      where: filters,
      attributes: ['id', 'name'],
      include: [
        {
          model: Specie,
          as: 'specie',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });

    return res.json(breeds);
  }
}

export default new BreedController();
