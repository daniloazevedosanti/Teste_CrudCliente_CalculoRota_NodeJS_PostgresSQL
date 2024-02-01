import React, { useState, useEffect, useCallback, useRef } from 'react';
import ClienteData from './components/ClienteData';
import CadastroCliente from './components/Cliente';
import 'bootstrap/dist/css/bootstrap.min.css';
import Rota from './components/Rota';
import axios from 'axios';
import './App.css';

function App() {
    const [clientes, setClientes] = useState([]);
    const [filtro, setFiltro] = useState({ campo: 'nome', valor: '' });
    const [exibirCadastro, setExibirCadastro] = useState(false);
    const [exibirRota, setExibirRota] = useState(false);
    const [carregandoRegistros, setCarregandoRegistros] = useState(false);
    const filtroRef = useRef();

    useEffect(() => {
        filtroRef.current = filtro;
    });

    const listarClientes = useCallback(() => {
        const filtro = filtroRef.current;
        setCarregandoRegistros(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/clientes${filtro.valor ? `?${filtro.campo}=${filtro.valor}` : ''}`)
            .then(response => setClientes(response.data))
            .catch(error => console.error(error))
            .finally(() => setCarregandoRegistros(false));
    }, [filtroRef]);

    useEffect(() => {
        listarClientes()
    }, [listarClientes]);

    const handleFecharCadastro = (atualizar = false) => {
        if (atualizar) listarClientes();
        setExibirCadastro(false);
    }

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex d-flex-row justify flex-wrap flex-md-nowrap align-items-center mb-4">
                <h1>Clientes</h1>
                <button className="btn btn-primary" onClick={() => setExibirCadastro(true)}>Novo Cliente</button>
            </div>
            <CadastroCliente exibir={exibirCadastro} onFechar={handleFecharCadastro} />

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4">
                <h1>Rota</h1>
                <button className="btn btn-primary" onClick={() => setExibirRota(true)}>Calcular Rota</button>
            </div>
            <Rota exibir={exibirRota} onFechar={() => setExibirRota(false)} />

            <div className="row justify-content-end mb-3">
                <div className="col-lg-4">
                    <div className="input-group">
                        <select className="form-select" value={filtro.campo} onChange={(e) => setFiltro({ ...filtro, campo: e.target.value })}>
                            <option value="nome">Nome</option>
                            <option value="email">E-mail</option>
                            <option value="telefone">Telefone</option>
                        </select>
                        <input type="text" placeholder="Filtrar" className="form-control" value={filtro.valor} onChange={(e) => setFiltro({ ...filtro, valor: e.target.value })} />
                        <button className="btn btn-outline-secondary" type="button" onClick={listarClientes}>Filtrar</button>
                    </div>
                </div>
            </div>

            <h2>Lista de Clientes</h2>
            {carregandoRegistros ? (
                <div className="text-center h4 my-5">
                    Aguarde...
                </div>
            ) : clientes.length > 0 ? (
                <ul className="list-group">
                    {clientes.map(cliente => (
                        <ClienteData key={cliente.id} cliente={cliente} />
                    ))}
                </ul>
            ) : (
                <div className="text-center h4 my-5">
                    Nenhum dado.
                </div>
            )}
            
        </div>
    );
}

export default App;
