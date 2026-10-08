const chaves = {
    areas: 'monitora-areas',
    disciplinas: 'monitora-disciplinas',
    monitores: 'monitora-monitores'
};

function ler(tipo) {
    try {
        const dados = JSON.parse(localStorage.getItem(chaves[tipo]) || '[]');
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function salvar(tipo, dados) {
    try {
        localStorage.setItem(chaves[tipo], JSON.stringify(dados));
        return true;
    } catch {
        return false;
    }
}

function criarId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function prepararDemonstracao() {
    const nomesAreas = [
        'Informática',
        'Matemática',
        'Linguagens',
        'Ciências Humanas',
        'Ciências da Natureza'
    ];
    const areas = ler('areas');

    nomesAreas.forEach((nome) => {
        const existe = areas.some((area) => area.nome.toLowerCase() === nome.toLowerCase());
        if (!existe) areas.push({ id: criarId(), nome });
    });
    salvar('areas', areas);

    const exemplos = [
        { nome: 'Programação Web', areaNome: 'Informática', descricao: 'HTML, CSS e JavaScript' },
        { nome: 'Banco de Dados', areaNome: 'Informática', descricao: 'Modelagem e consultas SQL' },
        { nome: 'Redes de Computadores', areaNome: 'Informática', descricao: 'Redes, protocolos e serviços' },
        { nome: 'Lógica de Programação', areaNome: 'Informática', descricao: 'Algoritmos e estruturas de repetição' },
        { nome: 'Matemática', areaNome: 'Matemática', descricao: 'Álgebra e resolução de problemas' },
        { nome: 'Língua Portuguesa', areaNome: 'Linguagens', descricao: 'Leitura e produção de texto' },
        { nome: 'História', areaNome: 'Ciências Humanas', descricao: 'Sociedade e contextos históricos' },
        { nome: 'Química', areaNome: 'Ciências da Natureza', descricao: 'Matéria, substâncias e reações químicas' },
        { nome: 'Física', areaNome: 'Ciências da Natureza', descricao: 'Movimento, energia e conceitos fundamentais' }
    ];
    const disciplinas = ler('disciplinas');

    exemplos.forEach((exemplo) => {
        const area = areas.find((item) => item.nome.toLowerCase() === exemplo.areaNome.toLowerCase());
        if (!area) return;

        const existe = disciplinas.some((disciplina) =>
            disciplina.nome.toLowerCase() === exemplo.nome.toLowerCase()
            && String(disciplina.areaId) === String(area.id));
        if (!existe) {
            disciplinas.push({
                id: criarId(),
                nome: exemplo.nome,
                descricao: exemplo.descricao,
                areaId: area.id,
                areaNome: area.nome
            });
        }
    });
    salvar('disciplinas', disciplinas);

    const monitoresDemonstracao = [
        {
            nome: 'John Doe',
            email: 'johndoe.oficial@gmail.com',
            telefone: '11 888888888',
            atendimento: 'Segunda-feira: 09:00 às 12:00'
        },
        {
            nome: 'Jane Doe',
            email: 'janedoe.oficial@gmail.com',
            telefone: '11 999999999',
            atendimento: 'Terça-feira: 13:00 às 17:00'
        }
    ];
    const monitores = ler('monitores');

    exemplos.forEach((exemplo) => {
        const disciplina = disciplinas.find((item) =>
            item.nome.toLowerCase() === exemplo.nome.toLowerCase()
            && item.areaNome.toLowerCase() === exemplo.areaNome.toLowerCase());
        if (!disciplina) return;

        monitoresDemonstracao.forEach((monitorExemplo) => {
            const existe = monitores.some((monitor) =>
                monitor.email.toLowerCase() === monitorExemplo.email.toLowerCase()
                && String(monitor.disciplinaId) === String(disciplina.id));
            if (!existe) {
                monitores.push({
                    ...monitorExemplo,
                    id: criarId(),
                    areaId: disciplina.areaId,
                    area: disciplina.areaNome,
                    disciplinaId: disciplina.id,
                    disciplina: disciplina.nome,
                    demonstracao: true
                });
            }
        });
    });
    salvar('monitores', monitores);
}

window.MonitoraCatalogo = { ler, salvar, criarId, prepararDemonstracao };
