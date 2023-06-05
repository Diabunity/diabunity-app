export default {
  user_info: {
    name: 'Johana Perez',
    age: 33,
    weight: 53,
    height: 167,
    diabetes_type: 2,
    glucose_info: {
      low: {
        min: null,
        max: 55,
      },
      range: {
        min: 55,
        max: 144,
      },
      high: {
        min: 144,
        max: null,
      },
      hyper: {
        min: 174,
        max: null,
      },
    },
    measurements_info: {
      metadata: {
        low: 3,
        in_range: 9,
        high: 4,
        hyper: 2,
      },
      results: [
        {
          timestamp: 1680133649,
          data: [
            {
              timestamp: 1680133699,
              value: 50,
            },
            {
              timestamp: 1680133699,
              value: 25,
            },
            {
              timestamp: 1680133699,
              value: 200,
            },
            {
              timestamp: 1680133699,
              value: 75,
            },
            {
              timestamp: 1680133699,
              value: 90,
            },
            {
              timestamp: 1680133699,
              value: 100,
            },
            {
              timestamp: 1680133699,
              value: 85,
            },
          ],
        },
      ],
    },
  },
};
