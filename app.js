let dados = carregarLocal()
let chart1, chart2

function mostrar(sec){
 document.querySelectorAll("section").forEach(s=>s.style.display="none")
 document.getElementById(sec).style.display="block"
}

function adicionarLinha(){
 tabelaDados.innerHTML+=`
 <tr>
 <td><input></td>
 <td><select><option>Pagina</option><option>Aluno</option></select></td>
 <td><input type="number"></td>
 <td><input type="number"></td>
 <td><input type="number"></td>
 <td><input type="number"></td>
 <td><input type="number"></td>
 <td><button onclick="this.parentElement.parentElement.remove()">X</button></td>
 </tr>`
}

function salvarTabela(){

 dados=[]

 document.querySelectorAll("#tabelaDados tr").forEach(tr=>{
 let t=tr.querySelectorAll("td")

 let obj={
  tema:t[0].children[0].value,
  autor:t[1].children[0].value,
  curtidas:+t[2].children[0].value,
  comentarios:+t[3].children[0].value,
  compartilhamentos:+t[4].children[0].value,
  salvamentos:+t[5].children[0].value,
  alcance:+t[6].children[0].value
 }

 if(obj.alcance==0)return

 obj.engajamento=(obj.curtidas+obj.comentarios+obj.compartilhamentos+obj.salvamentos)/obj.alcance

 dados.push(obj)
 })

 salvarLocal(dados)
 atualizar()
}

function atualizar(){

 if(dados.length==0)return

 let y=dados.map(d=>d.engajamento)
 let x=dados.map((_,i)=>i+1)

 let m=media(y)
 let d=desvio(y)

 let reg=regressao(x,y)
 let p=pValue(Math.abs(m/d))

 stats.innerHTML=`Média: ${m.toFixed(3)}<br>Desvio: ${d.toFixed(3)}<br>p-value: ${p.toFixed(3)}`

 gerarGraficos(x,y)
 progressoBarra()
 lembrete()
 orientador(m,d,p)
}

function gerarGraficos(x,y){

 if(chart1) chart1.destroy()

 chart1=new Chart(document.getElementById("graficoEngajamento"),{
  type:'line',
  data:{
   labels:x,
   datasets:[{
    label:"Engajamento",
    data:y
   }]
  }
 })

 if(chart2) chart2.destroy()

 chart2=new Chart(document.getElementById("graficoComparacao"),{
  type:'bar',
  data:{
   labels:dados.map(d=>d.tema),
   datasets:[{
    label:"Comparação",
    data:y
   }]
  }
 })
}

function progressoBarra(){
 let p=(dados.length/60)*100
 progresso.style.width=p+"%"
 textoProgresso.innerText=`${dados.length}/60`
}

function lembrete(){

 let ultima=localStorage.getItem("data")

 let hoje=new Date()

 if(ultima){
 let diff=(hoje-new Date(ultima))/(1000*60*60*24)
 if(diff>15){
  alert("⚠️ Coletar dados com Cláudia Pinheiro")
 }
 }

 localStorage.setItem("data",hoje)
}

function orientador(m,d,p){

 let msg=""

 if(m<0.05) msg+="Engajamento baixo\n"
 else msg+="Engajamento bom\n"

 if(p<0.05) msg+="Resultado relevante\n"

 orientador.innerText=msg
}

function gerarArtigo(){
 let texto=inputArtigo.value
 saidaArtigo.innerText=`RESULTADOS\n${texto}\n\nDISCUSSÃO\nAnálise científica gerada automaticamente.`
}

atualizar()
