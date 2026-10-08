(() => {
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
            if (!areas.some((area) => area.nome.toLocaleLowerCase('pt-BR') === nome.toLocaleLowerCase('pt-BR'))) {
                areas.push({ id: criarId(), nome });
            }
        });
        salvar('areas', areas);

        const nomesDisciplinas = [
            ['Programação Web', 'Informática', 'HTML, CSS e JavaScript'],
            ['Matemática', 'Matemática', 'Álgebra e resolução de problemas'],
            ['Língua Portuguesa', 'Linguagens', 'Leitura e produção de texto'],
            ['História', 'Ciências Humanas', 'Sociedade e contextos históricos'],
            ['Química', 'Ciências da Natureza', 'Matéria, substâncias e reações químicas'],
            ['Física', 'Ciências da Natureza', 'Movimento, energia e conceitos fundamentais']
        ];
        const disciplinas = ler('disciplinas');
        nomesDisciplinas.forEach(([nome, areaNome, descricao]) => {
            const area = areas.find((item) => item.nome.toLocaleLowerCase('pt-BR') === areaNome.toLocaleLowerCase('pt-BR'));
            const existe = disciplinas.some((disciplina) =>
                disciplina.nome.toLocaleLowerCase('pt-BR') === nome.toLocaleLowerCase('pt-BR')
                && String(disciplina.areaId) === String(area.id));
            if (area && !existe) {
                disciplinas.push({ id: criarId(), nome, descricao, areaId: area.id, areaNome: area.nome });
            }
        });
        salvar('disciplinas', disciplinas);
    }

    window.MonitoraCatalogo = { ler, salvar, criarId, prepararDemonstracao };
})();

alteration
