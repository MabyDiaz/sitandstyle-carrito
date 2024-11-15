const mpButton = document.getElementById('mp-btn');
if (mpButton) {
  mpButton.addEventListener('click', async () => {
    // Recupera los elementos del carrito y el total de la compra desde sessionStorage
    const carritoItems = JSON.parse(sessionStorage.getItem('carritoItems'));
    const totalCompra = parseFloat(sessionStorage.getItem('totalCompra'));

    if (carritoItems && totalCompra) {
      console.log(
        'Iniciando el pago con MercadoPago',
        carritoItems,
        totalCompra
      );

      // Envia los datos al backend para generar la orden en MercadoPago
      const response = await fetch('/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: carritoItems, total: totalCompra }),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point; // Redirige a MercadoPago
      } else {
        console.error('Error al obtener el link de pago:', data);
      }
    } else {
      console.error(
        'No se encontraron datos de carrito o total en sessionStorage'
      );
    }
  });
}

// // Botón de pago de Mercado Pago
// const mpBtn = document.getElementById('mp-btn');

// mpBtn.addEventListener('click', async () => {
//   const response = await fetch('/create-order', {
//     method: 'POST',
//   });

//   const data = await response.json();
//   console.log(data);

//   window.location.href = data.init_point;
// });
