import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formMonitoramento = document.getElementById('formMonitoramento');
  const tabelaAlimentacao = document.getElementById('tabelaAlimentacao').getElementsByTagName('tbody')[0];
  const tabelaMonitoramento = document.getElementById('tabelaMonitoramento').getElementsByTagName('tbody')[0];
  const adicionarLinhaBtn = document.getElementById('adicionarLinha');
  const clienteInfo = document.getElementById('cliente_info');
  const btnLogout = document.getElementById('btnLogout');

  obterClienteLogado(clienteInfo);

  adicionarLinhaBtn.addEventListener('click', () => {
    const novaLinhaAlimentacao = tabelaAlimentacao.insertRow();
    novaLinhaAlimentacao.innerHTML = `
      <td>
        <select class="semana" required>
          <option value="1">S1</option>
          <option value="2">S2</option>
          <option value="3">S3</option>
          <option value="4">S4</option>
        </select>
      </td>
      <td>
        <select class="dia_semana" required>
          <option value="DOM">DOM</option>
          <option value="SEG">SEG</option>
          <option value="TER">TER</option>
          <option value="QUA">QUA</option>
          <option value="QUI">QUI</option>
          <option value="SEX">SEX</option>
          <option value="SAB">SAB</option>
        </select>
      </td>
      <td>
        <select class="cafe" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="colacao" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="almoco" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="lanche" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="jantar" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="ceia" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="refeicao_livre" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
    `;

    const novaLinhaMonitoramento = tabelaMonitoramento.insertRow();
    novaLinhaMonitoramento.innerHTML = `
      <td>
        <select class="semana" required>
          <option value="1">S1</option>
          <option value="2">S2</option>
          <option value="3">S3</option>
          <option value="4">S4</option>
        </select>
      </td>
      <td>
        <select class="dia_semana" required>
          <option value="DOM">DOM</option>
          <option value="SEG">SEG</option>
          <option value="TER">TER</option>
          <option value="QUA">QUA</option>
          <option value="QUI">QUI</option>
          <option value="SEX">SEX</option>
          <option value="SAB">SAB</option>
        </select>
      </td>
      <td>
        <select class="atividade" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="hidratacao" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="intestino" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td>
        <select class="descanso" required>
          <option value="SIM">✔️</option>
          <option value="NAO">❌</option>
        </select>
      </td>
      <td><button type="button" class="removerLinha">Remover</button></td>
    `;

    novaLinhaMonitoramento.querySelector('.removerLinha').addEventListener('click', () => {
      tabelaAlimentacao.deleteRow(novaLinhaAlimentacao.rowIndex - 1);
      tabelaMonitoramento.deleteRow(novaLinhaMonitoramento.rowIndex - 1);
    });
  });

  formMonitoramento.addEventListener('submit', async (event) => {
    event.preventDefault();

    const mes = document.getElementById('mes').value;
    const linhasAlimentacao = tabelaAlimentacao.getElementsByTagName('tr');
    const linhasMonitoramento = tabelaMonitoramento.getElementsByTagName('tr');
    const cliente = await getClienteLogado();
    if (cliente) {
      for (let i = 0; i < linhasAlimentacao.length; i++) {
        const linhaAlimentacao = linhasAlimentacao[i];
        const linhaMonitoramento = linhasMonitoramento[i];
        const semana = linhaAlimentacao.querySelector('.semana').value;
        const diaSemana = linhaAlimentacao.querySelector('.dia_semana').value;
        const cafe = linhaAlimentacao.querySelector('.cafe').value;
        const colacao = linhaAlimentacao.querySelector('.colacao').value;
        const almoco = linhaAlimentacao.querySelector('.almoco').value;
        const lanche = linhaAlimentacao.querySelector('.lanche').value;
        const jantar = linhaAlimentacao.querySelector('.jantar').value;
        const ceia = linhaAlimentacao.querySelector('.ceia').value;
        const refeicaoLivre = linhaAlimentacao.querySelector('.refeicao_livre').value;
        const atividade = linhaMonitoramento.querySelector('.atividade').value;
        const hidratacao = linhaMonitoramento.querySelector('.hidratacao').value;
        const intestino = linhaMonitoramento.querySelector('.intestino').value;
        const descanso = linhaMonitoramento.querySelector('.descanso').value;

        // Verificação de duplicidade antes de registrar o monitoramento
        const duplicado = await verificarDuplicidade(cliente.ID, mes, semana, diaSemana);
        if (duplicado) {
          alert(`Já existe um registro para ${diaSemana} da semana ${semana} do mês ${mes}.`);
          return;
        }

        await registrarMonitoramento(cliente.ID, mes, semana, diaSemana, cafe, colacao, almoco, lanche, jantar, ceia, refeicaoLivre, atividade, hidratacao, intestino, descanso);
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

async function verificarDuplicidade(idCliente, mes, semana, diaSemana) {
  try {
    const { data, error } = await banco_supabase
      .from('tbmonitoramento')
      .select('*')
      .eq('idcliente', idCliente)
      .eq('mes', mes)
      .eq('semana', semana)
      .eq('dia_semana', diaSemana);

    if (error) {
      console.error('Erro ao verificar duplicidade:', error.message);
      return false;
    }

    return data.length > 0;
  } catch (err) {
    console.error('Erro inesperado ao verificar duplicidade:', err);
    return false;
  }
}

async function registrarMonitoramento(idCliente, mes, semana, diaSemana, cafe, colacao, almoco, lanche, jantar, ceia, refeicaoLivre, atividade, hidratacao, intestino, descanso) {
  try {
    const { error } = await banco_supabase
      .from('tbmonitoramento')
      .insert({
        idcliente: idCliente,
        mes: mes,
        semana: semana,
        dia_semana: diaSemana,
        cafe: cafe,
        colacao: colacao,
        almoco: almoco,
        lanche: lanche,
        jantar: jantar,
        ceia: ceia,
        refeicao_livre: refeicaoLivre,
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