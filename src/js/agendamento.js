import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formAgendamento = document.getElementById('formAgendamento');
  const clienteInfo = document.getElementById('cliente_info');
  const nutricionistaSelect = document.getElementById('nutricionista');
  const dataInput = document.getElementById('data');
  const horaInput = document.getElementById('hora');
  const motivoInput = document.getElementById('motivo');
  const btnLogout = document.getElementById('btnLogout');

  // Inicializa o Select2 no campo de seleção de nutricionistas
  $(nutricionistaSelect).select2({
    placeholder: 'Selecione um nutricionista',
    allowClear: true
  });

  obterClienteLogado(clienteInfo);
  listarNutricionistas(nutricionistaSelect);

  formAgendamento.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = dataInput.value;
    const hora = horaInput.value;
    const motivo = motivoInput.value;
    const idNutricionista = nutricionistaSelect.value;
    const nomeNutricionista = nutricionistaSelect.options[nutricionistaSelect.selectedIndex].text;

    const cliente = await getClienteLogado();
    if (cliente) {
      await agendarConsulta(cliente.ID, cliente.NOME, idNutricionista, nomeNutricionista, data, hora, motivo);
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
  });
});

async function obterClienteLogado(clienteInfo) {
  const cliente = await getClienteLogado();
  if (cliente) {
    clienteInfo.textContent = `Cliente: ${cliente.NOME} (${cliente.EMAIL})`;
  } else {
    clienteInfo.textContent = 'Cliente não encontrado.';
  }
}

async function getClienteLogado() {
  try {
    const IDUsuario = localStorage.getItem('IDUsuario');
    if (!IDUsuario) {
      console.error('ID do usuário não encontrado no localStorage.');
      return null;
    }
    console.log(`IDUsuario: ${IDUsuario}`); // Log para verificar o ID

    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('*')
      .eq('ID', IDUsuario)
      .single();

    if (error) {
      console.error('Erro ao obter cliente logado:', error.message);
      return null;
    }
    console.log('Cliente logado:', data); // Log para verificar os dados do cliente
    return data;
  } catch (err) {
    console.error('Erro inesperado ao obter cliente logado:', err);
    return null;
  }
}

async function listarNutricionistas(nutricionistaSelect) {
  const nutricionistas = await getNutricionistas();
  if (nutricionistas && nutricionistas.length > 0) {
    nutricionistas.forEach(nutricionista => {
      const option = new Option(nutricionista.NOME, nutricionista.ID, false, false);
      $(nutricionistaSelect).append(option).trigger('change');
    });
  } else {
    console.error('Nenhum nutricionista encontrado.');
  }
}

async function getNutricionistas() {
  try {
    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('ID, NOME')
      .eq('TIPOUSUARIO', 'A');

    if (error) {
      console.error('Erro ao listar nutricionistas:', error.message);
      return [];
    }
    return data;
  } catch (err) {
    console.error('Erro inesperado ao listar nutricionistas:', err);
    return [];
  }
}

async function agendarConsulta(idCliente, nomeCliente, idNutricionista, nomeNutricionista, data, hora, motivo) {
  try {
    const { error } = await banco_supabase
      .from('tbagendamento')
      .insert({
        idcliente: idCliente,
        nomecliente: nomeCliente,
        idnutricionista: idNutricionista,
        nomenutricionista: nomeNutricionista,
        data: data,
        hora: hora,
        motivo: motivo
      });

    if (error) {
      console.error('Erro ao agendar consulta:', error.message);
    } else {
      alert('Consulta agendada com sucesso!');
      console.log('Redirecionando para cliente.html'); // Log para verificar o redirecionamento
      window.location.href = 'cliente.html'; // Redireciona para a página do cliente
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}
