import { parseISO, isAfter } from 'date-fns';
import * as Yup from 'yup';
import db from '../../database/index';
import Pet from '../models/Pet';
import PetImages from '../models/PetImages';
import Citie from '../models/Citie';
import Breed from '../models/Breed';
import Specie from '../models/Specie';
import File from '../models/File';
import petImagesConfig from '../../config/petImage';

class PetController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const offset = (page - 1) * 10;

    const query = `
    SELECT
      pets.id,
      pets.name,
      cities.id AS citie_id,
      cities.name AS citie_name,
      cities.uf AS citie_uf,
      species.id AS specie_id,
      species.name AS specie_name,
      breeds.id AS breed_id,
      breeds.name AS breed_name,
      files.path AS profile_image
    FROM
      pets
    INNER JOIN
      cities ON pets.citie_id = cities.id
    INNER JOIN
      breeds ON pets.breed_id = breeds.id
    INNER JOIN
      species ON breeds.specie_id = species.id
    INNER JOIN
      pet_images ON pets.id = pet_images.pet_id
    LEFT JOIN
      files ON pet_images.file_id = files.id
    WHERE
      pets.user_id = ${req.userId}
      AND pet_images.is_profile_image = true
    ORDER BY
      pets.id ASC
    LIMIT 10
    OFFSET ${offset}
      `;

    const pets = await db.connection.query(query, {
      type: db.connection.QueryTypes.SELECT,
    });

    const data = pets.map(pet => {
      if (pet.profile_image !== null) {
        pet.profile_image = `http://localhost/3000/files/${pet.profile_image}`;
      }

      return pet;
    });

    return res.json(data);
  }

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
      return res.status(404).json({ error: 'Breed not found.' });
    }

    // Checks if citie exists
    const citie = await Citie.findByPk(citie_id);

    if (!citie) {
      return res.status(404).json({ error: 'Citie not found.' });
    }

    // Checks if date_of_birth is a valid date
    const date_birth = parseISO(date_of_birth);

    if (isAfter(date_birth, new Date())) {
      return res.status(400).json({ error: 'Future dates are not permitted.' });
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

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number(),
      name: Yup.string(),
      date_of_birth: Yup.date(),
      breed_id: Yup.number(),
      citie_id: Yup.number(),
    });

    try {
      await schema.validate({ ...req.body, ...req.params });
    } catch (err) {
      return res.status(400).json({ error: err.errors[0] });
    }

    const { id } = req.params;
    const {
      status,
      date_of_birth,
      breed_id,
      citie_id,
      name: petName,
    } = req.body;
    let objUpdate = {};

    const pet = await Pet.findByPk(id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' });
    }

    if (date_of_birth && isAfter(parseISO(date_of_birth), new Date())) {
      return res.status(400).json({ error: 'Future dates are not permitted.' });
    }

    if (date_of_birth && !isAfter(parseISO(date_of_birth), new Date())) {
      const date_birth = parseISO(date_of_birth);

      objUpdate = { ...objUpdate, date_birth };
    }

    if (breed_id) {
      const breedExists = await Breed.findByPk(breed_id, {
        where: {
          specie_id: pet.specie_id,
        },
      });

      if (!breedExists) {
        return res.status(404).json({ error: 'Breed not found.' });
      }

      objUpdate = { ...objUpdate, breed_id };
    }

    if (citie_id) {
      const citieExists = await Citie.findByPk(citie_id);

      if (!citieExists) {
        return res.status(404).json({ error: 'Citie not found.' });
      }

      objUpdate = { ...objUpdate, citie_id };
    }

    if (status && status.toLowerCase() === 'active') {
      objUpdate = { ...objUpdate, canceled_at: null };
    }

    if (status && status.toLowerCase() === 'inactive') {
      objUpdate = { ...objUpdate, canceled_at: new Date() };
    }

    if (petName) {
      objUpdate = { ...objUpdate, name: petName };
    }

    await pet.update(objUpdate);

    const [petData, breed, images] = await Promise.all([
      Pet.findByPk(id, {
        attributes: ['id', 'name', 'date_birth', 'status'],
        include: [
          {
            model: Citie,
            as: 'citie',
            attributes: ['id', 'name', 'uf'],
          },
        ],
      }),
      Breed.findByPk(pet.breed_id, {
        attributes: ['id', 'name'],
        include: [
          {
            model: Specie,
            as: 'specie',
            attributes: ['id', 'name'],
          },
        ],
      }),
      PetImages.findAll({
        where: {
          pet_id: id,
        },
        include: [
          {
            model: File,
            as: 'file',
            attributes: ['id', 'path', 'url'],
          },
        ],
      }),
    ]);

    // Get Age in years
    const today = new Date();
    const birthDate = new Date(petData.date_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return res.json({
      pet: { age, status: petData.status, ...petData.dataValues },
      specie: {
        id: breed.specie.id,
        name: breed.specie.name,
        breed: { id: breed.id, name: breed.name },
      },
      images,
    });
  }
}

export default new PetController();
