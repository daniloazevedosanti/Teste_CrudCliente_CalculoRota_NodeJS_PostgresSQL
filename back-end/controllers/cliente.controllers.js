const db = require('../db');

//CRUD Clientes

const listar = async (req, res) => {
    const { nome, email, telefone } = req.query;
    console.log({ nome, email, telefone });
    try {
        const { rows } = await db.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Erro ao buscar clientes' });
    }
};

const buscar = async (req, res) => {
    const { nome, email, telefone } = req.query;

    try {
        let query = 'SELECT * FROM clientes WHERE excluido_em IS NULL';
        const values = [];

        if (nome) {
            query += ` AND nome ILIKE $${values.length + 1}`;
            values.push(`%${nome}%`);
        }
        if (email) {
            query += ` AND email = $${values.length + 1}`;
            values.push(`${email}`);
        }
        if (telefone) {
            query += ` AND telefone = $${values.length + 1}`;
            values.push(`${telefone}`);
        }
        const { rows } = await db.query(query, values);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Erro ao buscar clientes' });
    }
};

const cadastrar = async (req, res) => {
    const { nome, email, telefone, coordenadaX, coordenadaY } = req.body;
   
    let validacaoReg = validacao(nome, email, telefone, coordenadaX, coordenadaY);

    if ( validacaoReg !== null) return res.status(400).json({ error: validacaoReg });

    try {
        await db.query('INSERT INTO clientes (nome, email, telefone, coordenadaX, coordenadaY) VALUES ($1, $2, $3, $4, $5)', [nome, email, telefone, coordenadaX === '' ? null : coordenadaX,  coordenadaY === '' ? null : coordenadaY]);
        res.status(201).json({ message: 'Cliente cadastrado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
};

const excluir = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query('UPDATE clientes SET excluido_em = CURRENT_TIMESTAMP WHERE id = $1', [id]);
        res.status(200).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
};

function validacao(nome, email, telefone, coordenadaX, coordenadaY){
    
    let validacao = null;
    if (!nome) validacao = 'O nome é inválido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validacao = 'O email é inválido';
    else if (!([10, 11].includes(telefone.replace(/[^0-9]/g, '').length))) validacao = 'O telefone é inválido';
    else if (!!coordenadaX && (isNaN(parseFloat(coordenadaX)) || !isFinite(coordenadaX))) validacao = 'Coordenada X é inválida';
    else if (!!coordenadaY && (isNaN(parseFloat(coordenadaY)) || !isFinite(coordenadaY))) validacao = 'Coordenada Y é inválida';

    return validacao;
};

module.exports = {
    listar,
    buscar,
    cadastrar,
    excluir,
};