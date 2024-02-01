const calcularDistancia = (point1, point2) => {
    return Math.sqrt((point1.coordenadaX - point2.coordenadaX) ** 2 + (point1.coordenadaY - point2.coordenadaY) ** 2);
};

module.exports = {
    calcularDistancia,
};