function media(arr){
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function desvio(arr){
  let m = media(arr);
  return Math.sqrt(arr.reduce((s,v)=>s+(v-m)**2,0)/arr.length);
}

function regressao(x,y){
  let mx = media(x);
  let my = media(y);

  let num = x.reduce((s,xi,i)=>s+(xi-mx)*(y[i]-my),0);
  let den = x.reduce((s,xi)=>s+(xi-mx)**2,0);

  let a = num/den;
  let b = my - a*mx;

  return {a,b};
}

function prever(x,a,b){
  return a*x + b;
}

function pValue(t){
  return Math.exp(-0.717*t - 0.416*t*t);
}
