import { Router } from 'express';
import { createOrder, receiveWebhook } from '../controllers/mp_controllers.js';

const router = Router();

// Pide a través del metodo get que le genere la cuenta le va a devolver la frase creating order
router.post('/create-order', createOrder);

// Cuado el usuario acepta el pago, generamos la ruta succes
router.get('/success', (req, res) => res.send('success'));

router.get('/failure', (req, res) => res.send('failure'));

router.get('/pending', (req, res) => res.send('pending'));

// Cuando el pago está pendiente
router.post('/webhook', receiveWebhook);



export default router;
