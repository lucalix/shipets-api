import Specie from '../models/Specie';
import File from '../models/File';

class SpecieController {
  async index(req, res) {
    const species = await Specie.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'name'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(species);
  }
}

export default new SpecieController();
