# Pathfinding Visualizer: Santa Cruz de la Sierra

Este proyecto es un simulador interactivo de Inteligencia Artificial diseñado para visualizar y comparar el rendimiento de los algoritmos **BFS**, **DFS** y **A*** sobre una representación real de la red vial de Santa Cruz de la Sierra, Bolivia.

## Descripción del Proyecto
El simulador permite a los usuarios seleccionar puntos de origen y destino directamente sobre un mapa interactivo. El sistema procesa los datos viales mediante un grafo ponderado, permitiendo observar en tiempo real cómo cada algoritmo explora el espacio de búsqueda y cómo las distintas estrategias impactan en la eficiencia del camino encontrado.

## Stack Tecnológico
* **Frontend:** HTML5, CSS3, JavaScript (ES6+).
* **Visualización de Mapas:** [Leaflet.js](https://leafletjs.com/) con capas de estilo oscuro.
* **Procesamiento de Datos:** Python utilizando la librería `OSMnx` para la extracción de nodos y aristas desde OpenStreetMap.
* **Estructura de Datos:** Grafo almacenado en formato `.json` (geolocalización y costos de adyacencia).

## Instalación y Ejecución

### Requisitos previos
* Tener instalado [Python](https://www.python.org/) para el servidor local.

### Pasos
1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/pathfinding-scz.git](https://github.com/tu-usuario/pathfinding-scz.git)
    cd pathfinding-scz
    ```
2.  **Ejecutar el servidor local:**
    *Debido a restricciones de seguridad (CORS) de los navegadores, no es posible abrir el archivo `index.html` directamente como archivo local.*
    ```bash
    # En la carpeta raíz del proyecto, ejecuta:
    python -m http.server 8000
    ```
3.  **Acceso:**
    Abre tu navegador y dirígete a `http://localhost:8000`.

## lgoritmos Implementados
* **BFS (Breadth-First Search):** Explora por niveles; garantiza el camino mínimo en grafos sin peso.
* **DFS (Depth-First Search):** Explora hasta la máxima profundidad; útil para resolución de laberintos, pero no siempre óptimo.
* **A* (A-star):** Utiliza la distancia euclidiana como heurística $h(n)$ para guiar la búsqueda de manera eficiente, equilibrando el costo real $g(n)$ con la estimación hacia el objetivo.

## Metodología de Evaluación
El proyecto incluye un panel de control donde se evalúan métricas clave:
* **Nodos explorados:** Cantidad de intersecciones analizadas antes de encontrar el objetivo.
* **Tiempo de ejecución:** Latencia del algoritmo en milisegundos.
* **Visualización:** Representación gráfica de la "frontera" de búsqueda (en color verde claro) vs. la ruta final (en color resaltado).

## Estructura de archivos
- `generar_mapa.py`: Script de Python para extraer y procesar la red vial real.
- `santa_cruz.json`: Dataset con los nodos (lat/lng) y adyacencias (costos).
- `script.js`: Implementación lógica de los algoritmos y manejo del mapa.
- `index.html`: Estructura e interfaz de usuario.
- `style.css`: Estilos visuales del simulador.

## Licencia
Este proyecto es de uso académico. Consulta el archivo `LICENSE` (si aplica) para más detalles.
