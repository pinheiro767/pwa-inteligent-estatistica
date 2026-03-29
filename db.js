function salvarLocal(d){
 localStorage.setItem("dados",JSON.stringify(d))
}

function carregarLocal(){
 return JSON.parse(localStorage.getItem("dados"))||[]
}
