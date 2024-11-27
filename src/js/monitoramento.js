import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formMonitoramento = document.getElementById('formMonitoramento');
  const tabelaMonitoramento = document.getElementById('tabelaMonitoramento').getElementsByTagName('tbody')[0];
  const adicionarLinhaBtn = document.getElementById('adicionarLinha');
  const clienteInfo = document.getElementById('cliente_info');
  const btnLogout = document.getElementById('btnLogout');

  obterClienteLogado(clienteInfo);

  adicionarLinhaBtn.addEventListener('click', () => {
    const novaLinha = tabelaMonitoramento.insertRow();
    novaLinha.innerHTML = `
      <td>
        <select class="semana" required>
          <option value="1">Semana 1</option>
          <option value="2">Semana 2</option>
          <option value="3">Semana 3</option>
          <option value="4">Semana 4</option>
        </select>
      </td>
      <td>
        <select class="dia_semana" required>
          <option value="Segunda">Segunda-feira</option>
          <option value="Terça">Terça-feira</option>
          <option value="Quarta">Quarta-feira</option>
          <option value="Quinta">Quinta-feira</option>
          <option value="Sexta">Sexta-feira</option>
          <option value="Sábado">Sábado</option>
          <option value="Domingo">Domingo</option>
        </select>
      </td>
      <td>
        <select class="alimentacao" required>
          <option value="SIM">SIM</option>
          <option value="NAO">NÃO</option>
        </select>
      </td>
      <td>
        <select class="atividade" required>
          <option value="SIM">SIM</option>
          <option value="NAO">NÃO</option>
        </select>
      </td>
      <td>
        <select class="hidratacao" required>
          <option value="SIM">SIM</option>
          <option value="NAO">NÃO</option>
        </select>
      </td>
      <td>
        <select class="intestino" required>
          <option value="SIM">SIM</option>
          <option value="NAO">NÃO</option>
        </select>
      </td>
      <td>
        <select class="descanso" required>
          <option value="SIM">SIM</option>
          <option value="NAO">NÃO</option>
        </select>
      </td>
      <td><button type="button" class="removerLinha">Remover</button></td>
    `;

    novaLinha.querySelector('.removerLinha').addEventListener('click', () => {
      tabelaMonitoramento.deleteRow(novaLinha.rowIndex - 1);
    });
  });

  formMonitoramento.addEventListener('submit', async (event) => {
    event.preventDefault();

    const mes = document.getElementById('mes').value;
    const linhas = tabelaMonitoramento.getElementsByTagName('tr');
    const cliente = await getClienteLogado();
    if (cliente) {
      for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        const semana = linha.querySelector('.semana').value;
        const diaSemana = linha.querySelector('.dia_semana').value;
        const alimentacao = linha.querySelector('.alimentacao').value;
        const atividade = linha.querySelector('.atividade').value;
        const hidratacao = linha.querySelector('.hidratacao').value;
        const intestino = linha.querySelector('.intestino').value;
        const descanso = linha.querySelector('.descanso').value;

        await registrarMonitoramento(cliente.ID, mes, semana, diaSemana, alimentacao, atividade, hidratacao, intestino, descanso);
      }
      alert('Monitoramento registrado com sucesso!');
      window.location.href = 'cliente.html';
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
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
    console.log(`IDUsuario: ${IDUsuario}`);

    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('*')
      .eq('ID', IDUsuario)
      .single();

    if (error) {
      console.error('Erro ao obter cliente logado:', error.message);
      return null;
    }
    console.log('Cliente logado:', data);
    return data;
  } catch (err) {
    console.error('Erro inesperado ao obter cliente logado:', err);
    return null;
  }
}

async function registrarMonitoramento(idCliente, mes, semana, diaSemana, alimentacao, atividade, hidratacao, intestino, descanso) {
  try {
    const { error } = await banco_supabase
      .from('tbmonitoramento')
      .insert({
        idcliente: idCliente,
        mes: mes,
        semana: semana,
        dia_semana: diaSemana,
        alimentacao: alimentacao,
        atividade: atividade,
        hidratacao: hidratacao,
        intestino: intestino,
        descanso: descanso
      });

    if (error) {
      console.error('Erro ao registrar monitoramento:', error.message);
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}
