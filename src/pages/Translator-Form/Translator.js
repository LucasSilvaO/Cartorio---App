import React, { useEffect } from 'react';
import './css/translator.css';
import { Alert, Input, FormGroup, Button, Label, Form, FormText, Spinner, List, Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import ListTranslator from './components/ListTranslators/ListTranslator';

import { editTranslator, fetchTranslators, createTranslator } from '../../services/api';

function Translator() {
  const [translatorForm, setTranslatorForm] = React.useState({
    nome :"",
    email :"",
    prazo_em_dias: ""
  });

  const [typeForm, setTypeForm] = React.useState('register');
  const [translators, setTranslators] = React.useState({
    count: 0,
    results: []
  });
  const [translatorToEdit, setTranslatorToEdit] = React.useState({});
  const [alert, setAlert] = React.useState(null);
  
  const fetchAndSetTranslators = async () => {
    const data = await fetchTranslators();
    setTranslators({
      count: data?.count ?? 0,
      results: data?.results ?? []
    });
  }

  useEffect(() => {
    fetchAndSetTranslators();
  }, []);

    return (
      <div className="clientForm">
      <Row className="mt-2" style={{padding: "0 10%"}}>
        <Col sm="6">
          <Button color="primary" onClick={() => setTypeForm('register')} style={{ marginRight: '10px' }}>
            Cadastrar
          </Button>
          <Button color="secondary" onClick={() => setTypeForm('edit')}>
            Editar
          </Button>
          <Button color="danger" onClick={() => setTypeForm('delete')} style={{ marginLeft: '10px' }}>
            Apagar
          </Button>
        </Col>
      </Row>
      <Row className="mt-2" style={{padding: "0 10%"}}>
      { typeForm === 'register' ? (<Col sm="6">
      <h3>Cadastrar Tradutor</h3>
      <div className="form-and-list" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form style={{ flex: 1, marginRight: '20px' }}>
        <FormGroup>
          <Label for="nome-tradutor">
          Nome do Tradutor
          </Label>
          <Input
          id="nome-tradutor"
          type='text'
          name='nome'
          placeholder='Digite o nome do tradutor'
          onChange={(e) => setTranslatorForm({...translatorForm, nome: e.target.value})}
          />
        </FormGroup>
        <FormGroup>
          <Label for="tradutor-email">
          E-mail
          </Label>
          <Input
          id="tradutor-email"
          name="email"
          placeholder="Digite o e-mail do tradutor"
          type="text"
          onChange={(e) => setTranslatorForm({...translatorForm, email: e.target.value})}
          />
        </FormGroup>
        <FormGroup>
          <Label for="prazo-tradutor">
          Prazo em dias
          </Label>
          <Input
          id="prazo-tradutor"
          name="prazo_em_dias"
          placeholder="Digite o prazo em dias"
          type="number"
          min="0"
          onChange={(e) => setTranslatorForm({...translatorForm, prazo_em_dias: e.target.value})}
          />
        </FormGroup>
        <Button color="success" onClick={async () => {
              const data = await createTranslator(translatorForm);
              if (data) {
                setAlert({
                  type: 'success',
                  message: 'Tradutor cadastrado com sucesso!'
                })
                fetchAndSetTranslators();
                setTimeout(() => {
                  setAlert(null);
                }, 5000);
              } else {
                setAlert({
                  type: 'error',
                  message: 'Erro ao cadastrar tradutor!'
                })
                setTimeout(() => {
                  setAlert(null);
                }, 5000);
              }
        }} style={{display:"flex", alignItems:"center"}} disabled={translatorForm.nome === '' || translatorForm.email === '' || translatorForm.prazo_em_dias === ''}>
          <Spinner color="light" id="submit-loading" size="sm"></Spinner>
          Cadastrar Tradutor
        </Button>
        </Form>
      </div>
      </Col>) :  typeForm === 'edit' ? (
      <Col sm="6">
        <Form>
        <FormGroup>
          <h3>Editar Tradutor</h3>
          <Label for="exampleSelect">Selecione o tradutor</Label>
          <Input type="select" name="select" id="exampleSelect" onChange={(e) => {
            if (e.target.value === '') {
              setTranslatorToEdit({
                nome: '',
                email: '',
                prazo_em_dias: ''
              })
              return;
            }
            setTranslatorToEdit(translators.results.find((translator) => translator.tradutor_id === parseInt(e.target.value)))}}>
            <option value="">Selecione o tradutor</option>
          { translators.results && translators.results.map((translator) => (
            <option key={translator.tradutor_id} value={translator.tradutor_id}>{translator.nome}</option>
          ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="nome-tradutor">Nome do Tradutor</Label>
          <Input type="text" name="nome" id="nome-tradutor" placeholder="Nome do tradutor" value={translatorToEdit.nome} onChange={
            (e) => setTranslatorToEdit({...translatorToEdit, nome: e.target.value})
          }/>
        </FormGroup>
        <FormGroup>
          <Label for="tradutor-email">E-mail</Label>
          <Input type="email" name="email" id="tradutor-email" placeholder="E-mail do tradutor" value={translatorToEdit.email} onChange={
            (e) => setTranslatorToEdit({...translatorToEdit, email: e.target.value})
          }/>
        </FormGroup>
        <FormGroup>
          <Label for="prazo-tradutor">Prazo em dias</Label>
          <Input type="number" name="prazo" id="prazo-tradutor" placeholder="Prazo em dias" value={translatorToEdit.prazo_em_dias} onChange={
            (e) => setTranslatorToEdit({...translatorToEdit, prazo_em_dias: e.target.value})
          }/>
        </FormGroup>
        <Button color="success" onClick={async () => {
          const data = await editTranslator(translatorToEdit)
          if (data) {
            setAlert({
              type: 'success',
              message: 'Tradutor editado com sucesso!'
            })
            fetchAndSetTranslators();
            setTimeout(() => {
              setAlert(null);
            }, 5000);
          } else {
            setAlert({
              type: 'error',
              message: 'Erro ao editar tradutor!'
            })
            setTimeout(() => {
              setAlert(null);
            }, 5000);
            
        }
        }
        }>Editar Tradutor</Button>
        </Form>
      </Col>
      ) : (
      <Col sm="6">
        <Form>
        <FormGroup>
          <h3>Apagar Tradutor</h3>
          <Label for="exampleSelect">Selecione o tradutor</Label>
          <Input type="select" name="select" id="exampleSelect" onChange={(e) => setTranslatorToEdit(translators.results.find((translator) => translator.tradutor_id === parseInt(e.target.value)))}> 
            <option value="">Selecione o tradutor</option>
          {translators.results && translators.results.map((translator) => (
            <option key={translator.tradutor_id} value={translator.tradutor_id}>{translator.nome}</option>
          ))}
          </Input>
        </FormGroup>
        <Button color="danger" onClick={async () => {
          const data = await editTranslator({...translatorToEdit, ativo: false})
          if (data) {
            setAlert({
              type: 'success',
              message: 'Tradutor apagado com sucesso!'
            })
            fetchAndSetTranslators();
            setTimeout(() => {
              setAlert(null);
            }, 5000);
          } else {
            setAlert({
              type: 'error',
              message: 'Erro ao apagar tradutor!'
            })
            setTimeout(() => {
              setAlert(null);
            }, 5000);
          }
        }}>Apagar Tradutor</Button>
        </Form>
      </Col>
      ) }
      <Col sm="6" className="mt-2">
        <ListTranslator translators={translators.results ? translators.results : []} />
      </Col>
      </Row>
      {alert && (
        <Alert color={alert.type} style={{position: 'fixed', bottom: '10px', right: '10px'}}>
          {alert.message}
        </Alert>
      )}
      </div>
    );
  }
  
  export default Translator;