import { telefone } from '../utils/mascara';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';

export default function CadastroCliente({ exibir, onFechar }) {
    const [novoCliente, setNovoCliente] = useState({ nome: '', email: '', telefone: '', coordenadaX: '', coordenadaY: '' });
    const [erros, setErros] = useState({});

    const cadastrarCliente = () => {
        if (!isFormValido()) return;
        const objEnviar = {...novoCliente};
        objEnviar.telefone = objEnviar.telefone.replace(/[^0-9]/g, '');
        objEnviar.coordenadaX = objEnviar.coordenadaX === '' ? null : objEnviar.coordenadaX;
        objEnviar.coordenadaY = objEnviar.coordenadaY === '' ? null : objEnviar.coordenadaY;

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/clientes`, objEnviar)
            .then(response => {
                alert(response.data.message);
                setNovoCliente({ nome: '', email: '', telefone: '', coordenadaX: '', coordenadaY: '' });
                onFechar(true);
            })
            .catch(error => {
                alert(error.response.data.error);
                console.error(error);
            });
    };

    const isFormValido = () => Object.keys(erros).length === 0;

    const validarForm = (campo, valor) => {
        const removerPropriedade = (obj, prop) => {
            const {[prop]: _, ...newObj} = obj;
            return newObj;
        }
        switch (campo) {
            case 'nome':
                if (!valor || valor.length < 3) setErros({...erros, nome: 'O campo é obrgatório'});
                else  setErros(removerPropriedade(erros, campo));
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) setErros({...erros, email: 'O endereço de e-mail é inválido'});
                else  setErros(removerPropriedade(erros, campo));
                break;
            case 'telefone':
                if (telefone(valor).length !== 14 && telefone(valor).length !== 15) setErros({...erros, telefone: 'O número de telefone é inválido'});
                else  setErros(removerPropriedade(erros, campo));
                break;
            case 'coordenadaX':
            case 'coordenadaY':
                if (!!valor && (isNaN(parseFloat(valor)) || !isFinite(valor))) setErros({...erros, [campo]: 'A coordenada é inválida'});
                else  setErros(removerPropriedade(erros, campo));
                break;
            default:
                break;
            }
    }

    const handleChangeForm = (campo) => {
        return (e) => {
            let valor = e.target.value;
            if (campo === 'telefone') valor = telefone(valor);
            setNovoCliente({ ...novoCliente, [campo]: valor });
            validarForm(campo, e.target.value);
        };
    };

    return (
        <Modal show={exibir} onHide={onFechar}>
            <Modal.Header closeButton>
                <Modal.Title>Cadastrar Novo Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" placeholder="Nome" value={novoCliente.nome} onChange={handleChangeForm('nome')} isInvalid={!!erros.nome} />
                        <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" value={novoCliente.email} onChange={handleChangeForm('email')} isInvalid={!!erros.email} />
                        <Form.Control.Feedback type="invalid">{erros.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control type="text" placeholder="Telefone" value={novoCliente.telefone} onChange={handleChangeForm('telefone')} isInvalid={!!erros.telefone} />
                        <Form.Control.Feedback type="invalid">{erros.telefone}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Coordenada X</Form.Label>
                        <Form.Control type="text" placeholder="Coordenada X" value={novoCliente.coordenadaX} onChange={handleChangeForm('coordenadaX')} isInvalid={!!erros.coordenadaX} />
                        <Form.Control.Feedback type="invalid">{erros.coordenadaX}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Coordenada Y</Form.Label>
                        <Form.Control type="text" placeholder="Coordenada Y" value={novoCliente.coordenadaY} onChange={handleChangeForm('coordenadaY')} isInvalid={!!erros.coordenadaY} />
                        <Form.Control.Feedback type="invalid">{erros.coordenadaY}</Form.Control.Feedback>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onFechar}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={cadastrarCliente} disabled={!isFormValido()}>
                    Cadastrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}