import osmnx as ox
import json

centro = (-17.7833, -63.1821)

print("Descargando mapa de Santa Cruz...")

G = ox.graph_from_point(
    centro,
    dist=4000,
    network_type='drive'
)

nodes_data = {}

for node, data in G.nodes(data=True):

    vecinos = []

    for neighbor in G.neighbors(node):

        edge_data = G.get_edge_data(node, neighbor)

        length = edge_data[0].get("length", 1)

        vecinos.append({
            "id": neighbor,
            "cost": length
        })

    nodes_data[node] = {
        "lat": data["y"],
        "lng": data["x"],
        "adj": vecinos
    }

with open("santa_cruz.json", "w") as f:
    json.dump(nodes_data, f)

print("✅ Grafo con distancias generado.")