import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupText,
  Alert,
  Spinner,
} from "reactstrap";
import { fetchClients, createBudget, fetchTranslators,fetchWithUrl, fetchSellers} from "../../services/api";
import { createBudgetBody, validateFormData } from "./utils/utilsBudget";



const BudgetForm = ({isService, client}) => {
  const [formData, setFormData] = useState({
    assessoria: "",
    nomeFamilia: "",
    documentos: {
      traducao: [],
      crc: [],
    },
    servicosDocumentos: {
      apostilamento: [],
      postagemEnvio: [],
    },
    cadastrosFiscais: [],
    origemOrcamento: null,
    prazoServico: null,
    vendedor: null,
    formaPagamento: "",
    quantidadeDocumentos: 0,
    valorTotal: 0,
    observacao: "",
    parcelas: null,
    valorParcela: "",
    valorEntrada: "",
    valorRestante: "",
    // ordemServico: null,
    dataPagamento: new Date().toISOString().split("T")[0],
    dataSegundaParcela: null,
    isService: isService,
  });
  const [clients, setClients] = useState([]);
  const [translators, setTranslators] = useState([]);
  const [sellers, setSellers] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loadings, setLoadings] = useState({
    budgetButton: false,
    fileLoading: false,
  });


  const fetchAndSetTranslators = async () => {
    const data = await fetchTranslators();
    setTranslators(data.results);
  }

  const fetchAndSetSellers = async () => {
    const data = await fetchSellers();    // Dados da sua API
  
    if (data.status === 200) {
      setSellers(data.data);
    }
  };

  const fetchAndSetAssesoria = async () => {
    let allClients = [];
    let nextPageUrl = null;
  
    const fetchPage = async (url = null) => {
      let response;
      if (allClients.length === 0) {
         response = await fetchClients();
      } else {
        response = await fetchWithUrl(nextPageUrl);
      }
      
      allClients = [...allClients, ...response.results];
      nextPageUrl = response.next;
  
      if (nextPageUrl) {
        await fetchPage(nextPageUrl);
      }
    };
  
    await fetchPage(); // começa com a primeira página
    setClients(allClients);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeSeller = (seller) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        vendedor: seller,
      };
    });
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (!checked) {
        setFormData((prevState) => {
            if (name === 'apostilamento' || name === 'postagemEnvio') {
                return {
                    ...prevState,
                    servicosDocumentos: {
                        ...prevState.servicosDocumentos,
                        [name]: [],
                    },
                    formaPagamento: "",
                    parcelas: 1,
                    valorParcela: "",
                    valorEntrada: "",
                    valorRestante: "",
                };
            } else {
                return {
                    ...prevState,
                    documentos: {
                        ...prevState.documentos,
                        [name]: [],
                    },
                    formaPagamento: "",
                    parcelas: 1,
                    valorParcela: "",
                    valorEntrada: "",
                    valorRestante: "",
                };
            }
        });
    } else {
        setFormData((prevState) => {
            const novoDocumento = { id: Date.now(), status: checked };
            if (name === 'apostilamento' || name === 'postagemEnvio') {
                return {
                    ...prevState,
                    servicosDocumentos: {
                        ...prevState.servicosDocumentos,
                        [name]: [...(prevState.servicosDocumentos[name] || []), novoDocumento],
                    },
                };
            } else {
                return {
                    ...prevState,
                    documentos: {
                        ...prevState.documentos,
                        [name]: [...(prevState.documentos[name] || []), novoDocumento],
                    },
                };
            }
        });
    }
};

  const addDocument = (type) => {
    setFormData((prevState) => {
      const novoDocumento = { id: Date.now(), status: true };
      return {
        ...prevState,
        documentos: {
          ...prevState.documentos,
          [type]: [...prevState.documentos[type], novoDocumento],
        },
      };
    });
  }

  const removeDocument = (index, type) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        documentos: {
          ...prevState.documentos,
          [type]: prevState.documentos[type].filter((doc, i) => i !== index),
        },
      };
    });

  }

  const addDocumentInfo = (type, index, field, value) => {
    setFormData((prevState) => {
      const documentos = [...prevState.documentos[type]];
      documentos[index] = {
        ...documentos[index],
        [field]: value,
      };
      return {
        ...prevState,
        documentos: {
          ...prevState.documentos,
          [type]: documentos,
        },
      };
    });
  }

  const addServicoDocumentoInfo = (type, index, field, value) => {
    setFormData((prevState) => {
      const servicosDocumentos = [...prevState.servicosDocumentos[type]];
      servicosDocumentos[index] = {
        ...servicosDocumentos[index],
        [field]: value,
      };
      return {
        ...prevState,
        servicosDocumentos: {
          ...prevState.servicosDocumentos,
          [type]: servicosDocumentos,
        },
      };
    });
  }


  const getTotalDocuments = () => {
    const documentTypes = Object.keys(formData.documentos);
    const totalDocuments = documentTypes.reduce((total, type) => {
      return total + (formData.documentos[type]?.length || 0);
    }, 0);
    return totalDocuments;
  }

  const getTotalValue = () => {
    const documentTypes = Object.keys(formData.documentos);
    const documentTypesServicos = Object.keys(formData.servicosDocumentos);
    const totalValueDocuments = documentTypes.reduce((total, type) => {
        return +(total + formData.documentos[type].reduce((acc, doc) => {
            const valor = doc.valor ? +doc.valor : (+doc.valorUnitario * +doc.quantidade || 0);
            return acc + valor;
        }, 0)).toFixed(2);
    }, 0);

    const totalValueServicos = documentTypesServicos.reduce((total, type) => {
        return total + formData.servicosDocumentos[type].reduce((acc, doc) => {
            const valor = doc.valor ? +doc.valor : (+doc.valorUnitario * +doc.quantidade || 0);
            return acc + valor;
        }, 0);
    }, 0);
    const totalValue = totalValueDocuments + totalValueServicos;
    return totalValue;
};

 const addCadastroFiscal = () => {
    setFormData((prevState) => {
      const novoCadastroFiscal = { id: Date.now(), status: true };
      return {
        ...prevState,
        cadastrosFiscais: [...prevState.cadastrosFiscais, novoCadastroFiscal],
      };
    });
 }

 const handleCadastrosFiscaisChange = (index, field, value) => {
  setFormData((prevState) => {
      const cadastrosFiscais = [...prevState.cadastrosFiscais];
      cadastrosFiscais[index] = {
          ...cadastrosFiscais[index],
          [field]: value,
      };
      return {
          ...prevState,
          cadastrosFiscais,
      };
  });
};


  useEffect(() => {
    setFormData((prevState) => {
      return {
        ...prevState,
        quantidadeDocumentos: getTotalDocuments(),
        valorTotal: getTotalValue(),
      };
    });
    if (formData.formaPagamento === "faturado") {
      setFormData((prevState) => {
        return {
          ...prevState,
          parcelas: null,
          valorParcela: getTotalValue(),
          valorEntrada: "",
          valorRestante: "",
          dataPagamento: new Date().toISOString().split("T")[0],
          dataSegundaParcela: null,
        };
      });
    }
    if (formData.formaPagamento === "aVista" && formData.parcelas === "1") {
      setFormData((prevState) => {
        return {
          ...prevState,
          parcelas: 1,
          valorParcela: getTotalValue(),
          valorEntrada: null,
          valorRestante: null,
          dataPagamento: new Date().toISOString().split("T")[0],
          dataSegundaParcela: null,
        };
      });
    }
    if (formData.formaPagamento === "aVista" && formData.parcelas === "2") {
      setFormData((prevState) => {
        return {
          ...prevState,
          valorParcela: getTotalValue(),
          valorRestante: `${getTotalValue() - formData.valorEntrada}`,
          dataPagamento: new Date().toISOString().split("T")[0],
          dataSegundaParcela: new Date().toISOString().split("T")[0],
        };
      });
    }
    if (formData.prazoServico === "data") {
      setFormData((prevState) => {
        return {
          ...prevState,
          diasCorridos: null,
        };
      });
    }
    if (formData.prazoServico === "diasCorridos") {
      setFormData((prevState) => {
        return {
          ...prevState,
          dataPrazo: null,
        };
      });
    }

  }, [formData.formaPagamento, formData.documentos, formData.cadastrosFiscais, formData.prazoServico, formData.parcelas, formData.valorEntrada]);

  const handleSubmit = async (e) => {
    const erros = validateFormData(formData);
    if (erros.length > 0) {
      for (let i = 0; i < erros.length; i++) {
        setAlerts((prevState) => {
          return [
            ...prevState,
            {
              type: "danger",
              message: erros[i],
            },
          ];
        });
      }
      setTimeout(() => {
        setAlerts([]);
      }, 5000);
      return;
    }
    const body = createBudgetBody(formData);
    setLoadings((prevState) => {
      return {
        ...prevState,
        budgetButton: true,
      };
  });
    const data = await createBudget(body);
    if (data.status === 201) {
      setLoadings((prevState) => {
        return {
          ...prevState,
          budgetButton: false,
        };
      });
      setAlerts((prevState) => {
        return [
          ...prevState,
          {
            type: "success",
            message: `${isService ? "Serviço" : "Orçamento"} n° ${data.data.budget_id} criado com sucesso!`,
          },
        ];
      });
      setTimeout(() => {
        setAlerts([]);
      }, 5000);
    }
    else {
      setAlerts((prevState) => {
        return [
          ...prevState,
          {
            type: "danger",
            message: "Erro ao criar orçamento!",
          },
        ];
      });
      setTimeout(() => {
        setAlerts([]);
      }, 5000);
      setLoadings((prevState) => {
        return {
          ...prevState,
          budgetButton: false,
        };
      });
    }
  };

  useEffect(() => {
    fetchAndSetAssesoria();
    if (isService) {
      fetchAndSetTranslators();
    }
    if (client) {
      setFormData((prevState) => {
        return {
          ...prevState,
          assessoria: client.cliente_id,
        };
      });
    }
    fetchAndSetSellers();
  }, []);

  return (
    <Container style={{ marginBottom: "20px", marginTop: "20px" }}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="assessoria">Assessoria</Label>
              <Input
                type="select"
                id="assessoria"
                name="assessoria"
                value={formData.assessoria}
                disabled={client} // Se for client como parametro, não pode mudar a assessoria
                onChange={handleChange}
                required
              >
                <option value="">Selecione a assessoria</option>
                {clients.map((client) => (
                  <option key={client.cliente_id} value={client.cliente_id}>
                    {client.nome}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="nomeFamilia">Nome da família</Label>
              <Input
                type="text"
                id="nomeFamilia"
                name="nomeFamilia"
                value={formData.nomeFamilia}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
          {/* {isService && (
            <Col md={6}>
              <FormGroup>
                <Label for="nomeFamilia">Orderm de Serviço <span style={{color: "red"}}>*</span></Label>
                <Input
                  type="text"
                  id="ordemServico"
                  name="ordemServico"
                  value={formData.ordemServico}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          )} */}
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Tipo de {isService ? "Serviço" : "Orçamento"}</Label>
              <div>
                <Input
                  type="checkbox"
                  id="apostilamento"
                  name="apostilamento"
                  onChange={handleCheckboxChange}
                />
                <Label for="apostilamento" className="ml-2">
                  Apostilamento
                </Label>
                <br />
                <Input
                  type="checkbox"
                  id="crc"
                  name="crc"
                  onChange={handleCheckboxChange}
                />
                <Label for="crc" className="ml-2">
                  CRC
                </Label>
                <br />
                <Input
                  type="checkbox"
                  id="postagemEnvio"
                  name="postagemEnvio"
                  onChange={handleCheckboxChange}
                />
                <Label for="postagemEnvio" className="ml-2">
                  Postagem/Envio
                </Label>
                <br />
                <Input
                  type="checkbox"
                  id="traducao"
                  name="traducao"
                  onChange={handleCheckboxChange}
                />
                <Label for="traducao" className="ml-2">
                  Tradução
                </Label>
              </div>
            </FormGroup>
          </Col>
          { !isService && (
            <Col md={6}>
            <FormGroup>
              <Label for="origemOrcamento">Origem do orçamento</Label>
              <Input
                type="select"
                id="origemOrcamento"
                name="origemOrcamento"
                value={formData.origemOrcamento}
                onChange={handleChange}
              >
                <option value="">Selecione a origem</option>
                <option value="Bitrix">Bitrix</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Google">Google</option>
                <option value="Indicação Cartório">Indicação Cartório</option>
                <option value="Indicação Cliente">Indicação Cliente</option>
              </Input>
            </FormGroup>
          </Col>)}

        </Row>

        <Row md={12}>
          <Col md={12}>
            <Row style={{marginTop: "20px", backgroundColor: "#f8f9fa", padding: "10px"}}>
              <Col md={8}>
              <FormGroup>
              <Label>Prazo para {isService ? "Serviço" : "Orçamento"}</Label>
              <div>
                <Input
                  type="radio"
                  id="colocarData"
                  name="prazoServico"
                  value="data"
                  onChange={handleChange}
                />
                <Label for="colocarData" className="ml-2">
                  Colocar Data
                </Label>
                <br />
                <Input
                  type="radio"
                  id="colocarDia"
                  name="prazoServico"
                  value="diasCorridos"
                  onChange={handleChange}
                />
                <Label for="colocarDia" className="ml-2">
                  Colocar Dia
                </Label>
              </div>
            </FormGroup>
              </Col>
              <Col md={4}>
              {formData.prazoServico === "data" && (
              <FormGroup>
                <Label for="dataPrazo">Data</Label>
                <Input
                  type="date"
                  id="dataPrazo"
                  name="dataPrazo"
                  value={formData.dataPrazo}
                  onChange={handleChange}
                />
              </FormGroup>
            )}
            {formData.prazoServico === "diasCorridos" && (
              <FormGroup>
                <Label for="diasCorridos">Dias corridos</Label>
                <Input
                  type="number"
                  id="diasCorridos"
                  name="diasCorridos"
                  value={formData.diasCorridos}
                  onChange={(e) => {
                    const minValue = 0;
                    const value = e.target.value;
                    if (value < minValue) {
                      e.target.value = minValue;
                    }
                    handleChange(e);
                  }}
                />
              </FormGroup>
            )}
              </Col>
            </Row>
            
            
              {/* Campos condicionais para tipo de orçamento */}
            {(formData.documentos.traducao.length > 0 && !isService) ? (
            <Col style={{marginTop: "20px", backgroundColor: "#f8f9fa", padding: "10px"}}>
              <h4>Documentos de Tradução</h4>
              {formData.documentos.traducao.map((documento, index) => (
                <div key={index}>
                  <Row>
                  <Col md={10}>
                    <h5>Documento de Tradução nº {index + 1}</h5>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                      <Button color="danger" onClick={() => removeDocument(index, "traducao")}>
                          <FaTrash />
                      </Button>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={5}>
                      <FormGroup>
                        <Label for={`idiomaTraducao-${index}`}>Idioma da Tradução</Label>
                        <Input type="select" id={`idiomaTraducao-${index}`} 
                          onChange={(e) => addDocumentInfo("traducao", index, "idioma", e.target.value)}>
                          <option value="">Selecione o idioma</option>
                          <option value="Ingles">Inglês</option>
                          <option value="Espanhol">Espanhol</option>
                          <option value="Frances">Francês</option>
                          <option value="Alemao">Alemão</option>
                          <option value="Italiano">Italiano</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    {isService && (
                         <Col md={5}>
                         <FormGroup>
                           <Label for={`idiomaTraducao-${index}`}>Selecione o Tradutor</Label>
                           <Input type="select" id={`idiomaTraducao-${index}`} 
                             onChange={(e) => addDocumentInfo("traducao", index, "tradutor", e.target.value)}>
                             <option value="">Selecione o tradutor</option>
                              {translators && translators.map((translator) => (
                                <option key={translator.tradutor_id} value={translator.tradutor_id}>
                                  {translator.nome}
                                </option>
                              )
                              )}
                           </Input>
                         </FormGroup>
                       </Col>
                    )}
                    <Col md={5}>
                      <FormGroup>
                        <Label for={`tipoAssinatura-${index}`}>Tipo de Assinatura</Label>
                        <Input type="select" id={`tipoAssinatura-${index}`}
                          onChange={(e) => addDocumentInfo("traducao", index, "tipoAssinatura", e.target.value)}
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="Assinatura Digital">Assinatura Digital</option>
                          <option value="Assinatura Física">Assinatura Física</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`tipoDocumento-${index}`}>Tipo de Documento</Label>
                        <Input type="select" id={`tipoDocumento-${index}`}
                          onChange={(e) => addDocumentInfo("traducao", index, "tipoDocumento", e.target.value)}
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="CERTIDÃO DE INTEIRO TEOR NASCIMENTO">
                            CERTIDÃO DE INTEIRO TEOR NASCIMENTO
                          </option>
                          <option value="CERTIDÃO DE INTEIRO TEOR ÓBITO">
                            CERTIDÃO DE INTEIRO TEOR ÓBITO
                          </option>
                          <option value="PROCURAÇÃO">PROCURAÇÃO</option>
                          <option value="CNN">CNN</option>
                          <option value="DOCUMENTOS TÉCNICOS">DOCUMENTOS TÉCNICOS</option>
                          <option value="CERTIDÃO DE BATISMO">CERTIDÃO DE BATISMO</option>
                          <option value="ESCRITURA PÚBLICA DE PATERNIDADE">
                            ESCRITURA PÚBLICA DE PATERNIDADE
                          </option>
                          <option value="ESCRITURA PÚBLICA DE MATERNIDADE">
                            ESCRITURA PÚBLICA DE MATERNIDADE
                          </option>
                          <option value="CPN">CPN</option>
                          <option value="CERTIDÃO NEGATIVA">CERTIDÃO NEGATIVA</option>
                          <option value="CERTIDÃO BREVE RELATO NASCIMENTO">
                            CERTIDÃO BREVE RELATO NASCIMENTO
                          </option>
                          <option value="CERTIDÃO BREVE RELATO CASAMENTO">
                            CERTIDÃO BREVE RELATO CASAMENTO
                          </option>
                          <option value="CERTIDÃO BREVE RELATO ÓBITO">
                            CERTIDÃO BREVE RELATO ÓBITO
                          </option>
                          <option value="DECLARAÇÃO DE MATERNIDADE">
                            DECLARAÇÃO DE MATERNIDADE
                          </option>
                          <option value="BATISMO">BATISMO</option>
                          <option value="CERTIDÃO DE CASAMENTO RELIGIOSO">
                            CERTIDÃO DE CASAMENTO RELIGIOSO
                          </option>
                          <option value="CERTIDÃO DE INTEIRO TEOR DE CASAMENTO RELIGIOSO COM EFEITO CIVIL">
                            CERTIDÃO DE INTEIRO TEOR DE CASAMENTO RELIGIOSO COM EFEITO CIVIL
                          </option>
                          <option value="CERTIFICATO DE NASCITA">
                            CERTIFICATO DE NASCITA
                          </option>
                          <option value="AVERBAÇÃO">AVERBAÇÃO</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`nomeDocumentoTraducao-${index}`}>Nome</Label>
                        <Input
                          type="text"
                          id={`nomeDocumentoTraducao-${index}`}
                          value={documento.nomeDocumento}
                          onChange={(e) => addDocumentInfo("traducao", index, "nomeDocumento", e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`valorTraducao-${index}`}>Valor</Label>
                        <InputGroup>
                        <InputGroupText addonType="prepend">R$</InputGroupText>
                        <Input
                          type="number"
                          id={`valorTraducao-${index}`}
                          defaultValue={documento.valor}
                          onChange={(e) => {
                            const minValue = 0;
                            const value = e.target.value;
                            if (value < minValue) {
                              e.target.value = minValue;
                            }
                            addDocumentInfo("traducao", index, "valor", e.target.value);
                          }}
                        />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button color="success" 
                onClick={() => addDocument("traducao")}
              >Adicionar Tradução</Button>
            </Col>
          ) : formData.documentos.traducao.length > 0 && (
            <Col style={{marginTop: "20px", backgroundColor: "#f8f9fa", padding: "10px"}}>
              <h4>Documentos de Tradução</h4>
              {formData.documentos.traducao.map((documento, index) => (
                <div key={index}>
                  <Row>
                  <Col md={10}>
                    <h5>Documento de Tradução nº {index + 1}</h5>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                      <Button color="danger" onClick={() => removeDocument(index, "traducao")}>
                          <FaTrash />
                      </Button>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label for={`idiomaTraducao-${index}`}>Idioma da Tradução</Label>
                        <Input type="select" id={`idiomaTraducao-${index}`} 
                          onChange={(e) => addDocumentInfo("traducao", index, "idioma", e.target.value)}>
                          <option value="">Selecione o idioma</option>
                          <option value="Ingles">Inglês</option>
                          <option value="Espanhol">Espanhol</option>
                          <option value="Frances">Francês</option>
                          <option value="Alemao">Alemão</option>
                          <option value="Italiano">Italiano</option>
                        </Input>
                      </FormGroup>
                    </Col>
                         <Col md={3}>
                         <FormGroup>
                           <Label for={`idiomaTraducao-${index}`}>Selecione o Tradutor</Label>
                           <Input type="select" id={`idiomaTraducao-${index}`} 
                             onChange={(e) => addDocumentInfo("traducao", index, "tradutor", e.target.value)}>
                             <option value="">Selecione o tradutor</option>
                              {translators && translators.map((translator) => (
                                <option key={translator.tradutor_id} value={translator.tradutor_id}>
                                  {translator.nome}
                                </option>
                              )
                              )}
                           </Input>
                         </FormGroup>
                       </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for={`tipoAssinatura-${index}`}>Tipo de Assinatura</Label>
                        <Input type="select" id={`tipoAssinatura-${index}`}
                          onChange={(e) => addDocumentInfo("traducao", index, "tipoAssinatura", e.target.value)}
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="Assinatura Digital">Assinatura Digital</option>
                          <option value="Assinatura Física">Assinatura Física</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`quantidade-${index}`}>Quantidade</Label>
                        <Input type="number" id={`quantidade-${index}`}
                          onChange={(e) => addDocumentInfo("traducao", index, "quantidade", e.target.value)}
                        >
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`modalidade-${index}`}>Modalidade</Label>
                        <Input
                          type="select"
                          id={`modalidade-${index}`}
                          value={documento.nomeDocumento}
                          onChange={(e) => addDocumentInfo("traducao", index, "modalidade", e.target.value)}
                        >
                          <option value="">Selecione a modalidade</option>
                          <option value="NORMAL">Normal</option>
                          <option value="EXPRESSO">Expresso</option>
                        </Input>
                      
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`valorTraducao-${index}`}>Valor</Label>
                        <InputGroup>
                        <InputGroupText addonType="prepend">R$</InputGroupText>
                        <Input
                          type="number"
                          id={`valorTraducao-${index}`}
                          defaultValue={documento.valor}
                          onChange={(e) => {
                            const minValue = 0;
                            const value = e.target.value;
                            if (value < minValue) {
                              e.target.value = minValue;
                            }
                            addDocumentInfo("traducao", index, "valor", e.target.value);
                          }}
                        />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ))}
            </Col>
          )}
          {formData.documentos.crc.length > 0 && (
            <Col style={{marginTop: "20px", backgroundColor: "#f8f9fa", padding: "10px"}}>
              <h4>Documentos de CRC</h4>
              {formData.documentos.crc.map((documento, index) => (
                <div key={index}>
                  <Row>
                  <Col md={10}>
                    <h5>Documento CRC nº{index + 1}</h5>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                      <Button color="danger" onClick={() => removeDocument(index, "crc")}>
                          <FaTrash />
                      </Button>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`tipoDocumentoCRC-${index}`}>Tipo de Documento</Label>
                        <Input type="select" id={`tipoDocumentoCRC-${index}`}
                          onChange={(e) => addDocumentInfo("crc", index, "tipoDocumento", e.target.value)}
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="Nascimento">Nascimento</option>
                          <option value="Casamento">Casamento</option>
                          <option value="Óbito">Óbito</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`nomeDocumentoCRC-${index}`}>Nome</Label>
                        <Input
                          type="text"
                          id={`nomeDocumentoCRC-${index}`}
                          value={documento.nomeDocumento}
                          onChange={(e) => {addDocumentInfo("crc", index, "nomeDocumento", e.target.value)}}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for={`valorCRC-${index}`}>Valor</Label>
                        <InputGroup>
                        <InputGroupText addonType="prepend">R$</InputGroupText>
                        <Input
                          type="number"
                          id={`valorCRC-${index}`}
                          defaultValue={documento.valor}
                          onChange={(e) => {
                            const minValue = 0;
                            const value = e.target.value;
                            if (value < minValue) {
                              e.target.value = minValue;
                            }
                            addDocumentInfo("crc", index, "valor", e.target.value)
                          }}
                        />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button color="success" 
                onClick={() => addDocument("crc")}
              >Adicionar CRC</Button>
            </Col>
          )}
          {formData.servicosDocumentos.apostilamento.length > 0 && (
            formData.servicosDocumentos.apostilamento.map((documento, index) => (
            <Row style={{marginTop: "20px" , backgroundColor: "#f8f9fa", padding: "10px"}}>
              <h4>Apostilamento</h4>
              <Col md={4}>
                <FormGroup>
                  <Label for="quantidadeApostilamento">Quantidade</Label>
                  <Input type="number" id="quantidadeApostilamento" 
                    onChange={(e) => addServicoDocumentoInfo("apostilamento", index, "quantidade", e.target.value)}
                    value={documento.quantidade}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>

                  <Label for="valorUnitarioApostilamento">Valor Unitário</Label>
                  <InputGroup>
                  <InputGroupText addonType="prepend">R$</InputGroupText>
                  <Input type="number"  id="valorUnitarioApostilamento" 
                    onChange={(e) => {
                      const minValue = 0;
                      const value = e.target.value;
                      if (value < minValue) {
                        e.target.value = minValue;
                      }  
                      addServicoDocumentoInfo("apostilamento", index, "valorUnitario", e.target.value)
                    }}
                    value={documento.valorUnitario}
                  />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valorTotalApostilamento" style={{fontSize: "15px"}}>Valor Total do Apostilamento</Label>
                  <Input type="text" id="valorTotalApostilamento"
                    value={`${((documento.valorUnitario && documento.quantidade) ? (documento.valorUnitario * documento.quantidade) : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    readOnly
                  />
                </FormGroup>
              </Col>
            </Row>
            ))
          )}
          {formData.servicosDocumentos.postagemEnvio.length > 0 && (
            formData.servicosDocumentos.postagemEnvio.map((documento, index) => (
            <Row style={{marginTop: "20px" , backgroundColor: "#f8f9fa", padding: "10px"}} >
              <h4>Postagem/Envio</h4>
              <Col md={4}>
                <FormGroup>
                  <Label for="quantidadePostagemEnvio">Quantidade</Label>
                  <Input type="number" id="quantidadePostagemEnvio" 
                    onChange={(e) => addServicoDocumentoInfo("postagemEnvio", index, "quantidade", e.target.value)}
                    value={documento.quantidade}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valorUnitarioPostagemEnvio">Valor Unitário</Label>
                  <InputGroup>
                  <InputGroupText addonType="prepend">R$</InputGroupText>
                  <Input type="number"  id="valorUnitarioPostagemEnvio" 
                    onChange={(e) => {
                      const minValue = 0;
                      const value = e.target.value;
                      if (value < minValue) {
                        e.target.value = minValue;
                      }
                      addServicoDocumentoInfo("postagemEnvio", index, "valorUnitario", e.target.value)
                    }}
                    value={documento.valorUnitario}
                  />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="valorTotalPostagemEnvio" style={{fontSize: "12px"}}>Valor Total da Postagem/Envio</Label>
                  <Input type="text" id="valorTotalPostagemEnvio"
                    value={`${((documento.valorUnitario && documento.quantidade) ? (documento.valorUnitario * documento.quantidade) : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                    readOnly
                  />
                </FormGroup>
              </Col>
            </Row>
            ))
          )}
          </Col>
        </Row>

        <Row style={{marginTop: "20px", backgroundColor: "#f8f9fa", padding: "20px"}}>
          {/*Validadar com Joel {!isService && ( */}
            <Col md={6}>
            <FormGroup>
                <Label>Vendedor</Label>
                <div>
                  {sellers && sellers.map((seller) => (
                    <FormGroup check key={`${seller.vendedor_id}`}>
                      <Label check>
                        <Input
                          type="radio"
                          name="vendedor"
                          value={`${seller.nome}`}
                          onChange={(e) => {
                            handleChangeSeller(seller);
                          }
                          }
                        />
                        {`${seller.nome}`}
                      </Label>
                    </FormGroup>))}
                </div>
              </FormGroup>
            </Col>
          {/* )} */}
  {/* /validar com Joel        {!isService && ( */}
            <Col md={6}>
            <Col>
            <FormGroup>
              <Label for="formaPagamento">Forma de pagamento</Label>
              <Input
                type="select"
                id="formaPagamento"
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleChange}
              >
                <option value="">Selecione o pagamento</option>
                <option value="aVista">À Vista</option>
                <option value="faturado">Faturado</option>
              </Input>
            </FormGroup>
            {/* Campos condicionais para forma de pagamento */}
            {formData.formaPagamento === "aVista" ? (
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="parcelas">Parcelas</Label>
                    <Input
                      type="select"
                      id="parcelas"
                      name="parcelas"
                      value={formData.parcelas}
                      onChange={handleChange}
                    >
                      <option value="">Selecione a quantidade</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  {/* Campos condicionais para forma de pagamento */}
                  {formData.parcelas === "2" ? (
                    <Row>
                    <FormGroup>
                      <Label for="valorEntrada">Valor Entrada</Label>
                      <InputGroup>
                      <InputGroupText addonType="prepend">R$</InputGroupText>
                      <Input
                        type="number"
                        id="valorEntrada"
                        name="valorEntrada"
                        min={1}
                        max={`${getTotalValue()}`}
                        value={formData.valorEntrada}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const maxValue = getTotalValue() - 1;
                          const minValue = 1;
                          const newValue = Math.max(Math.min(value, maxValue), minValue);
                          handleChange({ target: { name, value: newValue } });
                      }}
                      />
                      </InputGroup>
                    </FormGroup>
                      <FormGroup>
                      <Label for="valorRestante">Valor Restante</Label>
                      <Input
                        type="text"
                        id="valorRestante"
                        name="valorRestante"
                        value={(getTotalValue() - formData.valorEntrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="dataSegundaParcela">Data 2º Parcela</Label>
                      <Input
                        type="date"
                        id="dataSegundaParcela"
                        name="dataSegundaParcela"
                        value={formData.dataSegundaParcela}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    </Row>
                  ) :  (
                    <Row>
                    <FormGroup>
                    <Label for="valorParcela">Valor</Label>
                    <Input
                      type="text"
                      id="valorParcela"
                      name="valorParcela"
                      value={(getTotalValue()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="dataPagamento">Data do Pagamento</Label>
                    <Input
                      type="date"
                      id="dataPagamento"
                      name="dataPagamento"
                      value={formData.dataPagamento}
                      onChange={handleChange}
                    />
                  </FormGroup>
                      </Row>
                  )}

                </Col>
              </Row>
            ) : (
              <Row>
              <FormGroup>
                 <Label for="valorParcela">Valor</Label>
                 <InputGroup>
                 
                 <Input
                 type="text"
                 id="valorParcela"
                 name="valorParcela"
                 value={(getTotalValue()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 onChange={handleChange}
                 />
                  </InputGroup>
                 </FormGroup>
                 <FormGroup>
                 <Label for="dataPagamento">Data do Pagamento</Label>
                 <Input
                 type="date"
                 id="dataPagamento"
                 name="dataPagamento"
                 value={formData.dataPagamento}
                 onChange={handleChange}
                 />
                 </FormGroup>
              </Row>
            )}
          </Col>
         
          <Col md={6}>
            <FormGroup>
              <Label for="quantidadeDocumentos">Quantidade de documentos</Label>
              <Input
                type="number"
                id="quantidadeDocumentos"
                name="quantidadeDocumentos"
                value={getTotalDocuments()}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="valorTotal">Valor total</Label>
              <Input
                type="text"
                id="valorTotal"
                name="valorTotal"
                value={(getTotalValue()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                readOnly
              />
            </FormGroup>
          </Col>

            </Col>
          {/* )}     */}
     </Row>
        <FormGroup>
          <Label for="observacao">Observação</Label>
          <Input
            type="textarea"
            id="observacao"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
        </FormGroup>
        <Row>
            <Container style={{backgroundColor: "#f8f9fa", padding: "20px"}}>
              <Row>
              {formData.cadastrosFiscais.map((cadastro, index) => (
                <div key={index}>
                    <Row>
                      <Col md={10}>
                        <h4>Responsável Fiscal {index + 1}</h4>
                      </Col>
                      <Col md={2}>
                          <Button color="danger" onClick={() => setFormData((prevState) => {
                              return {
                                  ...prevState,
                                  cadastrosFiscais: prevState.cadastrosFiscais.filter((cad, i) => i !== index),
                              };
                          })}>
                              <FaTrash />
                          </Button>
                      </Col>
                    </Row>         
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`nome-${index}`}>Nome</Label>
                                <Input
                                    type="text"
                                    id={`nome-${index}`}
                                    value={cadastro.nome || ''}
                                    onChange={(e) => handleCadastrosFiscaisChange(index, 'nome', e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for={`cnpjCpf-${index}`}>CNPJ/CPF</Label>
                                <Input
                                    type="text"
                                    id={`cnpjCpf-${index}`}
                                    value={cadastro.cnpjCpf || ''}
                                    onChange={(e) => handleCadastrosFiscaisChange(index, 'cnpjCpf', e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for={`telefone-${index}`}>Telefone</Label>
                                <Input
                                    type="text"
                                    id={`telefone-${index}`}
                                    value={cadastro.telefone || ''}
                                    onChange={(e) => handleCadastrosFiscaisChange(index, 'telefone', e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`email-${index}`}>Email</Label>
                                <Input
                                    type="email"
                                    id={`email-${index}`}
                                    value={cadastro.email || ''}
                                    onChange={(e) => handleCadastrosFiscaisChange(index, 'email', e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for={`endereco-${index}`}>Endereço</Label>
                                <Input
                                    type="text"
                                    id={`endereco-${index}`}
                                    value={cadastro.endereco || ''}
                                    onChange={(e) => handleCadastrosFiscaisChange(index, 'endereco', e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for={`cep-${index}`}>CEP</Label>
                                <Input
                                    type="text"
                                    id={`cep-${index}`}
                                    value={cadastro.cep || ''}
                                    onChange={(e) => handleCadastrosFiscaisChange(index, 'cep', e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            ))}
              </Row>
          </Container>
          <Col md={6}>
            <Button color="success" 
              onClick={addCadastroFiscal}
            >Adicionar Cadastro Fiscal</Button>
          </Col>
        </Row>
        <Col md={6} className="text-right" style={{marginTop: "20px"}}>
            <Button type="button" color="primary" onClick={handleSubmit}>
              Cadastrar {isService ? "Serviço" : "Orçamento"}{" "}
              <Spinner size="sm" color="light" style={{display: loadings.budgetButton ? "inline-block" : "none"}}/>
            </Button>
          </Col>
      </Form>
      {alerts.length > 0 && (
        <Row>
          <Col md={2} style={{position: 'fixed', bottom: '10px', right: '10px'}}>
            {alerts.map((alert, index) => (
              <Alert key={index} color={alert.type}>
                {alert.message}{' '}
                {alert.type === "danger" ? (
                  <FaTimes/>
                ): 
                <FaCheck/>
                }
              </Alert>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default BudgetForm;
