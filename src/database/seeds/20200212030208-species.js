module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'species',
      [
        {
          id: 1,
          name: 'Cachorro',
          avatar_id: null,
          canceled_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Gato',
          avatar_id: null,
          canceled_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
