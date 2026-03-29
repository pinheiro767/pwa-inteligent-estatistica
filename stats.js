function media(a){
  return a.reduce((s,v)=>s+v,0)/a.length
}

function desvio(a){
 let m=media(a)
 return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length)
}

function regressao(x,y){
 let mx=media(x), my=media(y)
 let num=x.reduce((s,xi,i)=>s+(xi-mx)*(y[i]-my),0)
 let den=x.reduce((s,xi)=>s+(xi-mx)**2,0)
 let a=num/den, b=my-a*mx
 return {a,b}
}

function pValue(t){
 return Math.exp(-0.717*t - 0.416*t*t)
}
