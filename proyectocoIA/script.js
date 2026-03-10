const map = L.map('map').setView([-17.7833,-63.1821],14)

L.tileLayer(
'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
).addTo(map)

let nodes={}
let startNode=null
let endNode=null

let exploracionGroup=L.layerGroup().addTo(map)
let rutaFinalGroup=L.layerGroup().addTo(map)

fetch('santa_cruz.json')
.then(r=>r.json())
.then(data=>{
nodes=data
})



// DISTANCIA REAL EN METROS
const dist = (a, b) => {

let p1 = L.latLng(nodes[a].lat, nodes[a].lng)
let p2 = L.latLng(nodes[b].lat, nodes[b].lng)

return p1.distanceTo(p2)

}



// SELECCIONAR NODOS EN EL MAPA
map.on('click',(e)=>{

const ids=Object.keys(nodes)

const closest=ids.reduce((a,b)=>{

const dA=L.latLng(nodes[a].lat,nodes[a].lng).distanceTo(e.latlng)
const dB=L.latLng(nodes[b].lat,nodes[b].lng).distanceTo(e.latlng)

return dA<dB?a:b

})

if(!startNode){

startNode=closest

L.circleMarker(
[nodes[startNode].lat,nodes[startNode].lng],
{color:'#46b780',radius:8}
).addTo(map)

document.getElementById('status').innerText="Selecciona destino"

}

else if(!endNode){

endNode=closest

L.circleMarker(
[nodes[endNode].lat,nodes[endNode].lng],
{color:'#ff4d4d',radius:8}
).addTo(map)

document.getElementById('status').innerText="Listo para buscar"

}

})



// PANEL DE ESTRUCTURA DE DATOS
function mostrarEstructura(frontier, tipo, actual){

let html=""

if(tipo==="bfs")
html+="<b>COLA (FIFO)</b><br><br>"

else if(tipo==="dfs")
html+="<b>PILA (LIFO)</b><br><br>"

else if(tipo==="ucs")
html+="<b>COLA PRIORIDAD (COSTO)</b><br><br>"

else if(tipo==="greedy")
html+="<b>COLA HEURÍSTICA</b><br><br>"

else if(tipo==="astar")
html+="<b>COLA PRIORIDAD A*</b><br><br>"

html+="Nodo actual:<br>"+actual+"<br><br>"

html+="Frontera:<br>"

frontier.forEach(n=>{
html+=`<div style="padding:4px;border-bottom:1px solid #444">${n}</div>`
})

if(frontier.length===0){
html+="(vacía)"
}

document.getElementById("estructura").innerHTML=html

}



// CALCULAR DISTANCIA TOTAL
function calcularCostoRuta(path){

let total=0

for(let i=0;i<path.length-1;i++){

total+=dist(path[i],path[i+1])

}

return total

}



// EXPLICACIÓN DEL ALGORITMO
function explicarPaso(curr,vecinos,tipo,gScore){

let texto=""

texto+="Nodo actual: "+curr+"\n\n"

if(tipo==="astar"){

let g=gScore[curr]
let h=dist(curr,endNode)
let f=g+h

texto+="Algoritmo A*\n\n"

texto+="g(n) = "+g.toFixed(2)+" metros\n"
texto+="h(n) = "+h.toFixed(2)+" metros\n"
texto+="f(n) = "+f.toFixed(2)+"\n\n"

texto+="f(n) = g(n) + h(n)\n\n"

}

else if(tipo==="ucs"){

texto+="Uniform Cost Search\n"
texto+="Explora el nodo con menor costo acumulado\n\n"

}

else if(tipo==="greedy"){

texto+="Greedy Best First\n"
texto+="Usa solo la heurística (distancia al objetivo)\n\n"

}

else if(tipo==="bfs"){

texto+="Breadth First Search\n"
texto+="Explora nivel por nivel usando una COLA\n\n"

}

else if(tipo==="dfs"){

texto+="Depth First Search\n"
texto+="Explora profundidad usando una PILA\n\n"

}

texto+="Vecinos encontrados:\n"

vecinos.forEach(v=>{
texto+="- "+v+"\n"
})

document.getElementById("explicacionRuta").innerText=texto

}



// EJECUTAR BÚSQUEDA
async function ejecutarAIMA(){

if(!startNode||!endNode)return

exploracionGroup.clearLayers()
rutaFinalGroup.clearLayers()

const tipo=document.getElementById('algo').value
const speed=101-parseInt(document.getElementById('speed').value)

let frontier=[startNode]
let explored=new Set()
let prev={}

let gScore={}
Object.keys(nodes).forEach(n=>gScore[n]=Infinity)

gScore[startNode]=0

let found=false

while(frontier.length>0){

let curr

if(tipo==="bfs") curr=frontier.shift()
else if(tipo==="dfs") curr=frontier.pop()

else{

frontier.sort((a,b)=>{

if(tipo==="astar")
return (gScore[a]+dist(a,endNode))-(gScore[b]+dist(b,endNode))

if(tipo==="ucs")
return gScore[a]-gScore[b]

if(tipo==="greedy")
return dist(a,endNode)-dist(b,endNode)

})

curr=frontier.shift()

}

mostrarEstructura(frontier, tipo, curr)

if(curr===endNode){

found=true
break

}

explored.add(curr)

document.getElementById('nodeCount').innerText=explored.size

let vecinos=nodes[curr].adj.map(n=>String(n))

explicarPaso(curr,vecinos,tipo,gScore)

for(let neighbor of vecinos){

if(explored.has(neighbor))continue

let tentative = gScore[curr] + dist(curr,neighbor)

if(tentative < gScore[neighbor]){

gScore[neighbor]=tentative
prev[neighbor]=curr

if(!frontier.includes(neighbor)){

frontier.push(neighbor)

L.polyline(
[
[nodes[curr].lat,nodes[curr].lng],
[nodes[neighbor].lat,nodes[neighbor].lng]
],
{
color:'#46b780',
weight:2,
opacity:0.4
}
).addTo(exploracionGroup)

}

}

}

await new Promise(r=>setTimeout(r,speed))

}



if(found){

document.getElementById('status').innerText="Ruta encontrada"

let curr=endNode
let path=[]
let coords=[]

while(curr){

path.push(curr)
coords.push([nodes[curr].lat,nodes[curr].lng])

if(curr===startNode)break

curr=prev[curr]

}

path.reverse()
coords.reverse()

const poly=L.polyline(coords,{color:'#ff4d4d',weight:6})
.addTo(rutaFinalGroup)

map.fitBounds(poly.getBounds())

let costo=calcularCostoRuta(path)

let resultado="\n\nRESULTADO FINAL\n\n"

resultado+="Algoritmo: "+tipo.toUpperCase()+"\n\n"

resultado+="Ruta encontrada:\n"

path.forEach(n=>{
resultado+=n+"\n"
})

resultado+="\nDistancia total: "+costo.toFixed(2)+" metros"

resultado+="\nNodos explorados: "+explored.size

document.getElementById("explicacionRuta").innerText+=resultado

}

}



document.getElementById("startBtn").onclick=ejecutarAIMA