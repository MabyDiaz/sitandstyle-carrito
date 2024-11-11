async function initializeMP() {
  try {
    // Obtiene la Public Key desde el backend
    const response = await fetch('http://localhost:3000/get_public_key');
    const data = await response.json();

    // Inicializa Mercado Pago con la Public Key
    const mp = new MercadoPago(data.publicKey, {
      locale: 'es-AR',
    });

    // Obtiene el preferenceId y crea el botón de pago
    initializePayment(mp);
  } catch (error) {
    console.error('Error al obtener la Public Key:', error);
  }
}

async function initializePayment(mp) {
  try {
    // Realiza una solicitud POST al backend para crear la preferencia
    const response = await fetch('http://localhost:3000/create_preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    // Verifica si el backend envió un ID de preferencia válido
    if (data.id) {
      // Crea el "wallet" usando el preferenceId recibido
      mp.bricks().create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: data.id,
        },
        callbacks: {
          onReady: () => {
            console.log('Botón de pago listo.');
          },
          onError: (error) => {
            console.error('Error al crear el botón de pago:', error);
          },
        },
      });
    } else {
      console.error('No se recibió un preferenceId válido');
    }
  } catch (error) {
    console.error('Error al obtener el preferenceId:', error);
  }
}

// Inicializa el SDK de Mercado Pago al cargar la página
initializeMP();
