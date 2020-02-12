import * as Yup from 'yup';
import Citie from '../models/Citie';

class CitieController {
  async index(req, res) {
    const schema = Yup.object().shape({
      state_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.query);
    } catch (err) {
      return res.status(400).json({ error: err.errors[0] });
    }

    const { state_id } = req.query;

    const cities = await Citie.findAll({
      where: {
        state_id,
      },
      attributes: ['id', 'name', 'uf', 'state_id'],
      order: [['name', 'ASC']],
    });

    return res.json(cities);
  }
}

export default new CitieController();
