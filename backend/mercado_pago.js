// import { MercadoPagoConfig, Preference } from 'mercadopago';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configura las credenciales
// const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

// const preference = new Preference(client);

// const createPreference = async (req, res) => {
//   try {
//     const body = {
//       payment_methods: {
//         excluded_payment_methods: [],
//         excluded_payment_types: [],
//         installments: 6,
//       },
//       items: [
//         {
//           title: 'My product',
//           quantity: 1,
//           unit_price: 2000,
//         },
//       ],
//     };

//     // Crea la preferencia
//     const response = await preference.create({ body });

//     // Envía el ID de la preferencia al frontend
//     res.json({ id: response.body.id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error al crear la preferencia');
//   }
// };

// // Exporta la función para usarla en `server.js`
// export { createPreference };

import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Configura el cliente de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

// Define la función para crear una preferencia de pago
const createPreference = async (req, res) => {
  try {
    const preference = new Preference(client);

    // Crea la preferencia con los detalles del producto
    const response = await preference.create({
      body: {
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 6,
        },
        items: items.map(item => ({
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
        })),
      },
    });

    // Envía el `preferenceId` al frontend
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    res.status(500).send('Error al crear la preferencia');
  }
};

export { createPreference };
