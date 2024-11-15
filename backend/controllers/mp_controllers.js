import mercadopago from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

export const createOrder = async (req, res) => {
  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
  });

  const { items } = req.body; // Recibe los productos del carrito desde el body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: 'Los items del carrito están vacíos o no son válidos' });
  }

  const mercadoPagoItems = items.map((item) => {
    console.log(
      `Producto: ${item.producto.nombre}, Precio: ${item.producto.precio}, Cantidad: ${item.cantidad}`
    );
    return {
      title: item.producto.nombre,
      unit_price: item.producto.precio,
      quantity: item.cantidad,
      currency_id: 'ARS',
    };
  });

  try {
    const result = await mercadopago.preferences.create({
      items: mercadoPagoItems,
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      notification_url: 'https://e8e4262122c68f2cb080072a06555488.serveo.net',
    });

    console.log(result);

    res.send(result.body);
  } catch (error) {
    console.error('Error al crear la orden en Mercado Pago:', error);
    res.status(500).json({ error: error.message });
  }
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
