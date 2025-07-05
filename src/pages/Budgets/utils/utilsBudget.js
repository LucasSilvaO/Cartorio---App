export const createBudgetBody = (formData) => {
    const allDocuments = Object.entries(formData.documentos).flatMap(([tipoDocumento, docs]) =>
        docs.map(doc => ({
            ...doc,
            tipo_documento: tipoDocumento.toUpperCase(), // Converte a chave para maiúsculas
            quantidade: doc.quantidade || 1 // Adiciona quantidade: 1 se não tiver quantidade
        }))
    );
    const allServiceDocuments = Object.entries(formData.servicosDocumentos || {}).flatMap(([nome, valores]) =>
        valores.map(valor => ({
            tipo_servico: nome.toLocaleUpperCase(), // Converte o nome para maiúsculas
            quantidade: valor.quantidade ? +valor.quantidade : 1,
            valor_unitario: +valor.valorUnitario,
            valor_total: valor.quantidade * valor.valorUnitario
        }))
    );
    
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    console.log(formData);
    const body = {
        origem: formData.origem,
        cliente: formData.assessoria,
        familia: {
            nome_da_familia: formData.nomeFamilia,
            ativo: formData.familiaAtiva || true
        },
        prazo: formData.prazo,
        comprovante_pagamento: formData.comprovantePagamento || null,
        forma_de_pagamento: formData.formaPagamento === "aVista" ? "A VISTA" : formData.formaPagamento.toUpperCase(),
        quantidade_de_documentos: formData.documentos.length,
        numero_de_parcelas: formData.parcelas ? +formData.parcelas : null,
        valor_de_entrada: formData.valorEntrada,
        valor_restante: formData.valorRestante,
        data_segunda_parcela: formData.dataSegundaParcela || null,
        observacoes: formData.observacao,
        valor: formData.valorTotal.toFixed(2),
        origem: formData.origemOrcamento,
        prazo: formData.prazoServico === "data" ? formData.dataPrazo : addDays(new Date(), +formData.diasCorridos).toISOString().split('T')[0],
        quantidade_de_documentos: allDocuments.length,
        documentos: allDocuments.map(doc => ({
            nome: doc.nomeDocumento ? doc.nomeDocumento : "Conjunto de documentos (Serviço)",
            tipo_documento: doc.tipo_documento.toUpperCase(),
            descricao: doc.tipoDocumento ? doc.tipoDocumento : "Conjunto de documentos (Serviço)",
            idioma_da_traducao: (doc.idioma && doc.idioma?.toUpperCase()) || null,
            tradutor: doc.tradutor || null,
            tipo_de_assinatura: doc.tipoAssinatura,
            quantidade: doc.quantidade ? doc.quantidade : null,
            valor: doc.valor ? doc.valor : (doc.quantidade * doc.valorUnitario) || 0,
        })),
        servicos_documentos: allServiceDocuments,
        numero_ca: formData.isService ? formData.ordemServico : null,
        responsaveis_fiscais: formData.cadastrosFiscais.map(cadastro => ({
            nome: cadastro.nome,
            email: cadastro.email,
            telefone: cadastro.telefone,
            cpf_cnpj: cadastro.cnpjCpf,
            endereco: cadastro.endereco,
            cep: cadastro.cep,
            ativo: cadastro.ativo || true
        })),
        status: formData.isService ? "EM ANDAMENTO" : "ORCAMENTO",
        usuario: JSON.parse(sessionStorage.getItem('user')).user_id
    };

    if (formData.vendedor) {
        body.vendedor = {
            nome: formData.vendedor.nome,
            ativo: formData.vendedorAtivo || true,
            id_conta_azul: formData.vendedor.vendedor_id || null
        };
    }

    return body;

};
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
export const updateDocumentsBody = ({ translationDocuments, selectedTradutor, modalidade, dataEntrada, prazoTipo, prazoData, prazoDias, dataDevolucao }) => {
    const body = translationDocuments.map(doc => ({
        documento_id: doc.documento_id,
        nome: doc.nome,
        tipo_documento: "TRADUCAO",
        descricao: doc.descricao,
        idioma_da_traducao: doc.idioma_da_traducao || null,
        tipo_de_assinatura: doc.tipo_de_assinatura,
        quantidade: doc.quantidade || null,
        data_entrada_tradutor: dataEntrada,
        data_devolucao: dataDevolucao || null,
        modalidade: modalidade.toUpperCase(),
        prazo: prazoTipo === "data" ? prazoData : prazoTipo === "dias" ? addDays(new Date(), +prazoDias).toISOString().split('T')[0] : null,
        valor: doc.valor,
        tradutor: +selectedTradutor || null
    }));
    return {
        documentos: body
    };

}
export const updateTranslatorSignatureDocumentsBody = ({translationDocuments, physicalSignature, digitalSignature, sendDate, returnDate }) => {
    const tipoDeAssinatura = physicalSignature && digitalSignature
        ? 'Assinatura Física e Digital'
        : physicalSignature
        ? 'Assinatura Física'
        : digitalSignature
        ? 'Assinatura Digital'
        : 'N/A';

    const documentos = translationDocuments.map(doc => ({
        documento_id: doc.documento_id,
        tipo_de_assinatura: tipoDeAssinatura,
        data_envio_tradutor: sendDate || null,
        data_devolucao_tradutor: returnDate || null
    }));

    return { documentos };
};

export const updateCartorioClienteDocumentBody = ({ translationDocuments, cartorio, cliente }) => {
    
}


export const validateFormData = (formData) => {
    const errors = [];

    if (!formData.assessoria) {
        errors.push("Assessoria é obrigatória.");
    }

    if (!formData.nomeFamilia) {
        errors.push("Nome da família é obrigatório.");
    }
    // if (!formData.isService && !formData.vendedor) { VALIDAR COM JOEL
    //     errors.push("Vendedor é obrigatório.");
    // }
    if (!formData.vendedor) {
        errors.push("Vendedor é obrigatório.");
    }
    const totalDocumentCount = Object.values(formData.documentos).reduce((total, array) => total + array.length, 0);
    if (totalDocumentCount === 0) {
        errors.push("Pelo menos um documento é obrigatório.");
    }
    if (!formData.prazoServico) {
        errors.push("Prazo de serviço é obrigatório.");
    } else {
        if (formData.prazoServico === "diasCorridos" && !formData.diasCorridos) {
            errors.push("Dias corridos são obrigatórios.");
        }
        if (formData.prazoServico === "data" && !formData.dataPrazo) {
            errors.push("Data do prazo é obrigatória.");
        }
    }
    if (!formData.isService && !formData.origemOrcamento) {
        errors.push("Origem do orçamento é obrigatória.");
    }
    if (!formData.isService &&!formData.valorTotal) {
        errors.push("Informe o valor de cada documento.");
    }
    if (!formData.isService && !formData.formaPagamento) {
        errors.push("Forma de pagamento é obrigatória.");
    } else if (formData.formaPagamento === "aVista" && !formData.parcelas) {
        errors.push("Número de parcelas é obrigatório para pagamento à vista.");
    }

    if (!formData.valorEntrada && +formData.parcelas > 1) {
        errors.push("Valor de entrada é obrigatório.");
    }

    if (formData.prazoServico === "data" && !formData.dataPrazo) {
        errors.push("Data do prazo é obrigatória.");
    } else if (formData.prazoServico === "diasCorridos" && !formData.diasCorridos) {
        errors.push("Dias corridos são obrigatórios.");
    }

    if (formData.documentos.length === 0) {
        errors.push("Pelo menos um documento é obrigatório.");
    }

    // if (formData.isService && !formData.ordemServico) {
    //     errors.push("Número da ordem de serviço é obrigatório.");
    // }

    return errors;
};