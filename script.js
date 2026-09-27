const extensions=[
{name:"GUILib",cat:"gui",icon:"▣",desc:"Complete GUI extension for TurboWarp with panels, windows, controls, themes and a visual editor.",tags:["GUI","TurboWarp","Visual Editor"]},
{name:"TorchCoin",cat:"utility",icon:"₿",desc:"Scratch/TurboWarp extension for connecting to the TorchCoin API, accounts, balances and transactions.",tags:["API","Accounts","Transactions"]},
{name:"XN Server Storage",cat:"storage",icon:"☁",desc:"Stockage distant pour tes projets, basé uniquement sur ton serveur.",tags:["Server-only","Cloud Save","GET / POST"]},
{name:"XN Text Filter",cat:"text",icon:"Aa",desc:"Filtre les contenus indésirables avec une liste intégrée et des mots personnalisés.",tags:["Filtrage","Liste intégrée","Mots custom"]},
{name:"XN Color Picker",cat:"color",icon:"◉",desc:"Choisis une couleur et convertis facilement entre HEX et RGB.",tags:["Color Picker","HEX","RGB"]},
{name:"XN Color Values",cat:"color",icon:"◆",desc:"Crée des valeurs de couleur nommées utilisables dans ton projet.",tags:["Named Colors","HEX","RGB"]}
];
const files={
"GUILib":"GUILib",
"TorchCoin":"torchcoin",
"XN Server Storage":"XN_Server_Storage",
"XN Text Filter":"XN_Text_Filter",
"XN Color Picker":"XN_Color_Picker",
"XN Color Values":"XN_Color_Values"
};
const names={storage:"STOCKAGE",text:"TEXTE",color:"COULEUR",gui:"GUI",utility:"UTILITAIRE"};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),category=document.querySelector("#category"),count=document.querySelector("#count"),empty=document.querySelector("#empty");
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function render(){
 const q=search.value.toLowerCase().trim(), c=category.value;
 const list=extensions.filter(x=>(c==="all"||x.cat===c)&&(!q||x.name.toLowerCase().includes(q)||x.desc.toLowerCase().includes(q)||x.tags.some(t=>t.toLowerCase().includes(q))));
 count.textContent=list.length+" extension"+(list.length>1?"s":"");
 grid.innerHTML=list.map(x=>{
   const base=files[x.name];
   return `<article class="card"><div class="icon">${x.icon}</div><span class="tag">${names[x.cat]}</span><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p><div>${x.tags.map(t=>`<span class="feature">${esc(t)}</span>`).join("")}</div><div class="downloads"><a class="download" download href="${base}.txt">Télécharger TXT</a><a class="download alt" download href="${base}.js">JS</a></div></article>`;
 }).join("");
 empty.hidden=list.length!==0;
}
search.addEventListener("input",render);category.addEventListener("change",render);render();
