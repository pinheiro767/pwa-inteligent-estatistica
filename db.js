function salvarLocal(dados){
  localStorage.setItem("dados", JSON.stringify(dados));
}

function carregarLocal(){
  return JSON.parse(localStorage.getItem("dados")) || [];
}
