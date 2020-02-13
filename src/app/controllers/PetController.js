import { parseISO, isAfter } from 'date-fns';
import * as Yup from 'yup';
import Pet from '../models/Pet';
import PetImages from '../models/PetImages';
import Citie from '../models/Citie';
import Breed from '../models/Breed';
import petImagesConfig from '../../config/petImage';

class PetController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      date_of_birth: Yup.date().required(),
      breed_id: Yup.number().required(),
      citie_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors[0] });
    }

    const { name, date_of_birth, breed_id, citie_id } = req.body;

    // Checks if breed exists
    const breed = await Breed.findByPk(breed_id, {
      where: {
        canceled_at: null,
      },
    });

    if (!breed) {
      return res.status(401).json({ error: 'Breed not found.' });
    }

    // Checks if citie exists
    const citie = await Citie.findByPk(citie_id);

    if (!citie) {
      return res.status(401).json({ error: 'Citie not found.' });
    }

    // Checks if date_of_birth is a valid date
    const date_birth = parseISO(date_of_birth);

    if (isAfter(date_birth, new Date())) {
      return res.status(401).json({ error: 'Future dates are not permitted.' });
    }

    // Create Pet
    const { id: pet_id } = await Pet.create({
      name,
      user_id: req.userId,
      date_birth,
      breed_id,
      citie_id,
    });

    // Create empty PetImages rows
    const results = [];
    let isProfileImage = true;

    for (let i = 0; i < petImagesConfig.quantityMax; i += 1) {
      results.push(
        PetImages.create({
          pet_id,
          file_id: null,
          is_profile_image: isProfileImage,
        })
      );

      isProfileImage = false;
    }

    const petImages = await Promise.all(results);

    const petImagesFormated = petImages.map(image => {
      const {
        id,
        is_profile_image,
        url = null,
        path = null,
      } = image.dataValues;

      return { id, is_profile_image, url, path };
    });

    return res.json({
      id: pet_id,
      name,
      date_birth,
      breed_id,
      citie_id,
      images: [...petImagesFormated],
    });
  }
}

export default new PetController();
