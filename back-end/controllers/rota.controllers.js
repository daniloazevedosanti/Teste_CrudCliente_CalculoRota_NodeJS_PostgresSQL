const db = require('../db');

//Serviço de rota

const calcularRota = async (req, res) => {
    try {
        const filtro = req.query.cliente || [];
        
        let query = 'SELECT * FROM clientes WHERE coordenada_x IS NOT NULL AND coordenada_y IS NOT NULL';
        const values = [];

        if (filtro.length > 0) {
            query += ' AND id = ANY($1)';
            values.push(filtro);
        }
        
        const { rows } = await db.query(query, values);

        const clientes = rows;

        const n = clientes.length;
        const noVisitado = new Array(n).fill(false);
        const rota = [];
        const coordenadasEmpresa = { coordenada_x: 0, coordenada_y: 0 };
        let distancia = 0;

        let currentCliente = coordenadasEmpresa;

        for (let i = 0; i < n; i++) {
            let nearestCliente = null;
            let minDistance = Infinity;

            for (let j = 0; j < n; j++) {
                if (!noVisitado[j]) {
                    const distance = calcularDistancia(currentCliente, clientes[j]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestCliente = clientes[j];
                    }
                }
            }

            rota.push(nearestCliente);
            noVisitado[clientes.indexOf(nearestCliente)] = true;
            distancia += minDistance;
            currentCliente = nearestCliente;
        }

        distancia += calcularDistancia(rota[rota.length - 1], coordenadasEmpresa);
        res.json({ rota, distancia });

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Erro! Verifique o cálculo de rota' });
    }
};

const calcularDistancia = (point1, point2) => {
    return Math.sqrt((point1.coordenada_x - point2.coordenada_x) ** 2 + (point1.coordenada_y - point2.coordenada_y) ** 2);
};

module.exports = {
    calcularRota,
};