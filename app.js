let dados = carregarLocal();
let chart;

function adicionarLinha(){
  tabelaDados.innerHTML += `
  <tr>
    <td><input></td>
    <td>
      <select>
        <option>Pagina</option>
        <option>Aluno</option>
      </select>
    </td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><button onclick="this.parentElement.parentElement.remove()">❌</button></td>
  </tr>`;
}

function salvarTabela(){

  dados = [];

  document.querySelectorAll("#tabelaDados tr").forEach(tr=>{
    let tds = tr.querySelectorAll("td");

    let item = {
      tema: tds[0].children[0].value,
      autor: tds[1].children[0].value,
      curtidas:+tds[2].children[0].value,
      comentarios:+tds[3].children[0].value,
      compartilhamentos:+tds[4].children[0].value,
      salvamentos:+tds[5].children[0].value,
      alcance:+tds[6].children[0].value
    };

    item.engajamento =
      (item.curtidas+item.comentarios+item.compartilhamentos+item.salvamentos)/item.alcance;

    dados.push(item);
  });

  salvarLocal(dados);
  atualizar();
}

function atualizar(){

  if(dados.length===0) return;

  let y = dados.map(d=>d.engajamento);
  let x = dados.map((_,i)=>i+1);

  let m = media(y);
  let d = desvio(y);

  let reg = regressao(x,y);
  let pred = prever(x.length+1, reg.a, reg.b);

  let t = Math.abs(m/d);
  let p = pValue(t);

  stats.innerHTML = `
  Média: ${m.toFixed(3)}<br>
  Desvio: ${d.toFixed(3)}<br>
  Predição: ${pred.toFixed(3)}<br>
  p-value: ${p.toFixed(3)}
  `;

  gerarOrientador(m,d,p);

  if(chart) chart.destroy();

  chart = new Chart(grafico1,{
    type:'bar',
    data:{
      labels:dados.map(d=>d.tema),
      datasets:[{data:y}]
    }
  });

  atualizarProgresso();
  gerarCalendario();
}

/* 🤖 ORIENTADOR */
function gerarOrientador(m,d,p){

  let msg="";

  if(m < 0.05){
    msg += "⚠️ Engajamento baixo. Melhorar conteúdo.\n";
  } else {
    msg += "✅ Engajamento adequado.\n";
  }

  if(d > 0.05){
    msg += "⚠️ Dados muito variáveis.\n";
  }

  if(p < 0.05){
    msg += "📊 Resultado estatisticamente relevante.\n";
  }

  orientador.innerText = msg;
}

/* 📊 PROGRESSO */
function atualizarProgresso(){
  let total = 60;
  let atual = dados.length;
  let p = (atual/total)*100;

  progresso.style.width = p+"%";
  textoProgresso.innerText = `${atual}/60 análises`;
}

/* 📅 CALENDÁRIO */
function gerarCalendario(){
  let html="";
  for(let i=1;i<=365;i++){
    html+=`<div class="dia">${i}</div>`;
  }
  calendario.innerHTML=html;
}

/* 🔒 ARTIGO */
function abrirModoProf(){
  let s=prompt("Senha:");
  if(s==="prof2026"){
    areaProf.style.display="block";
  }
}

function gerarArtigo(){
  artigo.innerText="Artigo gerado automaticamente.";
}

atualizar();
