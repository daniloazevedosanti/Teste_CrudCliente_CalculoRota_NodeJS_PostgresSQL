const db = require('../db');
const { calcularDistancia } = require('../utils/distancia');

//Serviço de rota

const calcularRota = async (req, res) => {
    try {
        const filtro = req.query.cliente || [];
        
        let query = 'SELECT * FROM clientes WHERE coordenadaX IS NOT NULL AND coordenadaY IS NOT NULL';
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
        const coordenadasEmpresa = { coordenadaX: 0, coordenadaY: 0 };
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

module.exports = {
    calcularRota,
};