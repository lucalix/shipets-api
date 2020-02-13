import * as Yup from 'yup';
import PetImages from '../models/PetImages';
import Pet from '../models/Pet';
import File from '../models/File';

class PetImagesController {
  async update(req, res) {
    const schema = Yup.object().shape({
      petImageId: Yup.number().required(),
      file_id: Yup.number().required(),
    });

    try {
      await schema.validate({ ...req.body, ...req.params });
    } catch (err) {
      return res.status(400).json({ error: err.errors[0] });
    }

    const { petImageId } = req.params;
    const { file_id } = req.body;

    const fileExists = await File.findByPk(file_id);

    if (!fileExists) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Checks if Pet Image belongs to request user
    const petImage = await PetImages.findByPk(petImageId, {
      include: [
        {
          model: Pet,
          as: 'pet',
          where: {
            user_id: req.userId,
          },
        },
      ],
    });

    if (!petImage) {
      return res.status(404).json({ error: 'Pet Image not found.' });
    }

    await petImage.update({ file_id });

    const { id, pet_id, is_profile_image, file } = await PetImages.findByPk(
      petImageId,
      {
        include: [
          {
            model: File,
            as: 'file',
            attributes: ['id', 'path', 'url'],
          },
        ],
      }
    );

    return res.json({
      id,
      pet_id,
      is_profile_image,
      file,
    });
  }
}

export default new PetImagesController();
