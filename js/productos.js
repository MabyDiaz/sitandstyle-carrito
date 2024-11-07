class Producto {
  constructor(id, nombre, descripcion, estrellas, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estrellas = estrellas;
    this.precio = precio;
    this.imagen = imagen;
  }

  mostrarInfo() {
    return `ID: ${this.id} | Nombre: ${this.nombre} | Descripción: ${this.descripcion} | Precio: $${this.precio}`;
  }
}

class ProductoFisico extends Producto {
  constructor(
    id,
    nombre,
    descripcion,
    estrellas,
    precio,
    imagen,
    tipo,
    material,
    tipoMadera,
    color,
    reforzada,
    tapizada
  ) {
    super(id, nombre, descripcion, estrellas, precio, imagen);
    this.tipo = tipo;
    this.material = material;
    this.tipoMadera = tipoMadera;
    this.color = color;
    this.reforzada = reforzada;
    this.tapizada = tapizada;
  }

  // Sobresribe el método mostrarInfo para incluir información específica de los productos físicos
  mostrarInfo() {
    return `${super.mostrarInfo()} | Tipo: ${this.tipo} | Material: ${
      this.material
    } | Color: ${this.color} | ${
      this.reforzada ? 'Reforzada' : 'No reforzada'
    } | ${this.tapizada ? 'Tapizada' : 'No tapizada'}`;
  }
}

class ProductoDigital extends Producto {
  constructor(
    id,
    nombre,
    descripcion,
    estrellas,
    precio,
    imagen,
    formato,
    peso,
    urlDescarga
  ) {
    super(id, nombre, descripcion, estrellas, precio, imagen);
    this.formato = formato;
    this.peso = peso;
    this.urlDescarga = urlDescarga;
  }

  // Sobrescribe el método mostrarInfo para incluir información específica de los productos digitales
  mostrarInfo() {
    return `${super.mostrarInfo()} | Formato: ${this.formato} | Peso: ${
      this.peso
    } | URL de Descarga: ${this.urlDescarga}`;
  }
}

export { Producto, ProductoFisico, ProductoDigital };
