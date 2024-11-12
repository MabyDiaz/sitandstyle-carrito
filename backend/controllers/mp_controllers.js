import mercadopago from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

export const createOrder = async (req, res) => {
  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
  });

  const result = await mercadopago.preferences.create({
    items: [
      {
        title: 'Silla Kurve',
        unit_price: 2000,
        currency_id: 'ARS',
        quantity: 1,
      },
    ],
    back_urls: {
      success: 'http://localhost:3000/success',
      failure: 'http://localhost:3000/failure',
      pending: 'http://localhost:3000/pending',
    },
    notification_url:
      'https://69b4803570cc0d7fe96195a3a21a065e.serveo.net/webhook',
  });

  console.log(result);

  res.send(result.body);
};

export const receiveWebhook = async (req, res) => {
  // console.log(req.query);

  const payment = req.query;
  try {
    if (payment.type === 'payment') {
      const data = await mercadopago.payment.findById(payment['data.id']);
      console.log(data);

      // o lo podemos guardar en db (store in database)
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500).json({ error: error.message });
  }
};
