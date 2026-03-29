let dados = JSON.parse(localStorage.getItem("dados")) || [];
let chart;
let deferredPrompt;

/* TABELA */
function addRow(){
  dados.push({
    tema:"",
    autor:"Página",
    curtidas:0,
    comentarios:0,
    compartilhamentos:0,
    salvamentos:0,
    alcance:0
  });
  render();
}

function update(i,c,v){
  dados[i][c] = c=="tema"||c=="autor" ? v : +v;
}

function render(){

  tabelaDados.innerHTML = dados.map((d,i)=>`
  <tr>
    <td><input value="${d.tema}" onchange="update(${i},'tema',this.value)"></td>
    <td>
      <select onchange="update(${i},'autor',this.value)">
        <option ${d.autor=="Página"?"selected":""}>Página</option>
        <option ${d.autor=="Aluno"?"selected":""}>Aluno</option>
      </select>
    </td>
    <td><input type="number" value="${d.curtidas}" onchange="update(${i},'curtidas',this.value)"></td>
    <td><input type="number" value="${d.comentarios}" onchange="update(${i},'comentarios',this.value)"></td>
    <td><input type="number" value="${d.compartilhamentos}" onchange="update(${i},'compartilhamentos',this.value)"></td>
    <td><input type="number" value="${d.salvamentos}" onchange="update(${i},'salvamentos',this.value)"></td>
    <td><input type="number" value="${d.alcance}" onchange="update(${i},'alcance',this.value)"></td>
    <td><button onclick="del(${i})">X</button></td>
  </tr>
  `).join("");

  atualizar();
}

function del(i){
  dados.splice(i,1);
  render();
}

/* SALVAR */
function salvar(){
  localStorage.setItem("dados", JSON.stringify(dados));
  alert("Dados salvos!");
}

/* ESTATÍSTICA */
function media(a){return a.reduce((s,v)=>s+v,0)/a.length}
function desvio(a){
 let m=media(a)
 return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length)
}

function atualizar(){

  let validos = dados.filter(d=>d.alcance>0);

  if(validos.length==0) return;

  let y = validos.map(d=>
    (d.curtidas+d.comentarios+d.compartilhamentos+d.salvamentos)/d.alcance
  );

  let m = media(y);
  let d = desvio(y);
  let p = Math.exp(-0.717*(m/d) -0.416*(m/d)**2);

  stats.innerHTML = `
  Média: ${m.toFixed(3)}<br>
  Desvio: ${d.toFixed(3)}<br>
  p-value: ${p.toFixed(3)}
  `;

  orientador.innerHTML = `
  ${m<0.05?"⚠️ Baixo engajamento":"✅ Bom engajamento"}<br>
  ${p<0.05?"📊 Resultado relevante":"📉 Sem significância"}
  `;

  /* GRÁFICO */
  if(chart) chart.destroy();

  chart = new Chart(grafico,{
    type:'bar',
    data:{
      labels:validos.map(d=>d.tema),
      datasets:[{data:y}]
    }
  });

  /* PROGRESSO */
  let perc = (validos.length/60)*100;
  progresso.style.width = perc+"%";
  textoProgresso.innerText = validos.length+"/60";

}

/* LEMBRETE */
function lembrete(){
  let u = localStorage.getItem("ultima");
  let h = new Date();

  if(u){
    let diff = (h - new Date(u))/(1000*60*60*24);
    if(diff>15){
      alert("⚠️ Coletar dados com Cláudia Pinheiro");
    }
  }

  localStorage.setItem("ultima", h);
}

/* PWA INSTALAR */
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
});

function instalarApp(){
  if(deferredPrompt){
    deferredPrompt.prompt();
  }else{
    alert("Use 'Adicionar à tela inicial' no navegador");
  }
}

/* SERVICE WORKER */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js');
}

lembrete();
render();
