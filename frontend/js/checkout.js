import { carrito } from './script.js';

function finalizarCompra() {
  if (carrito.items.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No hay productos en el carrito para finalizar la compra.',
      customClass: {
        confirmButton: 'btn-ok',
      },
    });
    return;
  }

  const totalCompra = carrito.calcularTotal();
  Swal.fire({
    title: 'Confirmar compra',
    html: `El total de tu compra es: <strong>$${totalCompra.toFixed(
      2
    )}</strong>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Finalizar compra',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn-confirm',
      cancelButton: 'btn-cancel',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.items = []; // Limpiar el carrito
      carrito.guardarCarrito();
      carrito.mostrarCarrito();
      carrito.actualizarContador();

      Swal.fire({
        title: 'Compra realizada',
        text: '¡Gracias por tu compra!',
        icon: 'success',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'btn-ok',
        },
      }).then(() => {
        // Cierra el carrito y el overlay después de que el usuario presiona "Ok"
        const carritoElement = document.getElementById('carrito');
        const overlayElement = document.getElementById('overlay');

        if (carritoElement) carritoElement.classList.remove('show');
        if (overlayElement) overlayElement.classList.remove('show-overlay');
      });
    }
  });
}

export { finalizarCompra };
