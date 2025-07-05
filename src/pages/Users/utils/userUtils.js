export const createUserBody = (formData) => {
    const body = {
        username: formData.username,
        first_name: formData.nome,
        last_name: formData.sobrenome,
        email: formData.email,
        password: formData.senha,
        user_type: formData.atribuicao,
    };
    return body;
}

export const validateUser = (formData) => {
    const errors = [];
    if (!formData.nome) {
        errors.push("Nome é obrigatório");
    }
    if (!formData.sobrenome) {
        errors.push("Sobrenome é obrigatório");
    }
    if (!formData.email) {
        errors.push("Email é obrigatório");
    }
    if (!formData.senha) {
        errors.push("Senha é obrigatória");
    }
    if (!formData.confirmarSenha) {
        errors.push("Confirmação de senha é obrigatória");
    }
    if (formData.senha !== formData.confirmarSenha) {
        errors.push("Senhas não coincidem");
    }
    if (!formData.atribuicao) {
        errors.push("Atribuição é obrigatória");
    }
    return errors;
};