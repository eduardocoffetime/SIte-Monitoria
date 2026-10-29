const RADICAL_IFSP = "10882594";

const formulario = document.getElementById("campusForm");
const campoCnpj = document.getElementById("cnpj");
const campoTipoUnidade = document.getElementById("tipoUnidade");
const campoIdentificador = document.getElementById("identificador");
const mensagemStatus = document.getElementById("statusMessage");

function formatarCnpj(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 14);

  if (!digitos) return "";

  return digitos
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function eCnpjIfsp(cnpjBruto) {
  return cnpjBruto.slice(0, 8) === RADICAL_IFSP;
}

function obterTipoUnidade(cnpjBruto) {
  const filial = cnpjBruto.slice(8, 12);

  if (filial === "0001") {
    return {
      tipo: "Matriz / Reitoria",
      identificador: "Reitoria"
    };
  }

  return {
    tipo: "Campus / Filial",
    identificador: `Campus - ${filial}`
  };
}

function definirStatus(mensagem, tipo = "padrao") {
  mensagemStatus.textContent = mensagem;
  mensagemStatus.classList.remove("erro", "sucesso");

  if (tipo === "sucesso") {
    mensagemStatus.classList.add("sucesso");
  }

  if (tipo === "erro") {
    mensagemStatus.classList.add("erro");
  }
}

campoCnpj.addEventListener("input", (evento) => {
  evento.target.value = formatarCnpj(evento.target.value);

  const cnpjSemFormatacao = evento.target.value.replace(/\D/g, "");

  if (!cnpjSemFormatacao) {
    campoTipoUnidade.value = "Aguardando CNPJ";
    campoIdentificador.value = "—";
    definirStatus("Digite um CNPJ do IFSP para validar.");
    return;
  }

  if (cnpjSemFormatacao.length < 14) {
    campoTipoUnidade.value = "CNPJ incompleto";
    campoIdentificador.value = "—";
    definirStatus("CNPJ incompleto.", "erro");
    return;
  }

  if (!eCnpjIfsp(cnpjSemFormatacao)) {
    campoTipoUnidade.value = "Não é IFSP";
    campoIdentificador.value = "—";
    definirStatus("CNPJ não pertence ao IFSP.", "erro");
    return;
  }

  const unidade = obterTipoUnidade(cnpjSemFormatacao);
  campoTipoUnidade.value = unidade.tipo;
  campoIdentificador.value = unidade.identificador;

  const mensagem =
    unidade.tipo === "Matriz / Reitoria"
      ? "CNPJ do IFSP validado. Reitoria."
      : "CNPJ do IFSP validado. Campus / Filial.";

  definirStatus(mensagem, "sucesso");
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nomeCampus = document.getElementById("nomeCampus").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const cnpjBruto = campoCnpj.value.replace(/\D/g, "");

  if (!nomeCampus || !cidade || !cnpjBruto) {
    definirStatus("Preencha todos os campos.", "erro");
    return;
  }

  if (cnpjBruto.length !== 14 || !eCnpjIfsp(cnpjBruto)) {
    definirStatus("Cadastro inválido: o CNPJ deve pertencer ao IFSP.", "erro");
    return;
  }

  const unidade = obterTipoUnidade(cnpjBruto);
  definirStatus(`Campus salvo: ${nomeCampus} - ${unidade.tipo}.`, "sucesso");
});
