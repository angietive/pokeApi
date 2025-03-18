async function buscarPokemon() {
    const nombrePokemon = document.getElementById("pokemon-name").value.trim().toLowerCase();
    const contenedorInfo = document.getElementById("pokemon-info");
    contenedorInfo.innerHTML = "";

    if (!nombrePokemon) {
        const mensajeError = document.createElement("p");
        mensajeError.textContent = "Por favor, ingresa un nombre";
        mensajeError.style.color = "red";
        contenedorInfo.appendChild(mensajeError);
        return;
    }

    const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
    
    try {
        const respuesta = await fetch(urlPokemon);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado");
        const datos = await respuesta.json();

        // Obtener información de la especie (donde está la descripción en español)
        const urlEspecie = datos.species.url;
        const respuestaEspecie = await fetch(urlEspecie);
        const datosEspecie = await respuestaEspecie.json();

        // Obtener la descripción en español
        const descripcionEsp = datosEspecie.flavor_text_entries.find(entry => entry.language.name === "es");
        const descripcionTexto = descripcionEsp ? descripcionEsp.flavor_text.replace(/[\n\f]/g, " ") : "Descripción no disponible";

        // Obtener el nombre en español
        const nombreEsp = datosEspecie.names.find(n => n.language.name === "es");
        const nombrePokemonEsp = nombreEsp ? nombreEsp.name : datos.name.toUpperCase();

        // Obtener el hábitat en español
        const habitatIngles = datosEspecie.habitat ? datosEspecie.habitat.name : "unknown";
        const traduccionesHabitat = {
            "cave": "Cueva",
            "forest": "Bosque",
            "grassland": "Pradera",
            "mountain": "Montaña",
            "rare": "Raro",
            "rough-terrain": "Terreno difícil",
            "sea": "Mar",
            "urban": "Urbano",
            "waters-edge": "Orilla del agua",
            "unknown": "No disponible"
        };
        const habitatEspañol = traduccionesHabitat[habitatIngles] || "Desconocido";

        // Obtener el tipo en español
        const tipos = datos.types.map(tipo => {
            const tipoEncontrado = datosEspecie.genera.find(gen => gen.language.name === "es");
            return tipoEncontrado ? tipoEncontrado.genus : tipo.type.name;
        }).join(", ");

        // Crear elementos para mostrar la información
        const titulo = document.createElement("h2");
        titulo.textContent = nombrePokemonEsp;
        
        const imagen = document.createElement("img");
        imagen.src = datos.sprites.front_default;
        imagen.alt = nombrePokemonEsp;
        
        const descripcion = document.createElement("p");
        descripcion.innerHTML = `<strong>Descripción:</strong> ${descripcionTexto}`;

        const habilidades = document.createElement("p");
        habilidades.innerHTML = `<strong>Habilidades:</strong> ${datos.abilities.map(a => a.ability.name).join(", ")}`;
        
        const altura = document.createElement("p");
        altura.innerHTML = `<strong>Altura:</strong> ${datos.height / 10} m`;
        
        const peso = document.createElement("p");
        peso.innerHTML = `<strong>Peso:</strong> ${datos.weight / 10} kg`;

        const habitatTexto = document.createElement("p");
        habitatTexto.innerHTML = `<strong>Hábitat:</strong> ${habitatEspañol}`;

        const tipoTexto = document.createElement("p");
        tipoTexto.innerHTML = `<strong>Tipo:</strong> ${tipos}`;

        // Agregar elementos al contenedor
        contenedorInfo.appendChild(titulo);
        contenedorInfo.appendChild(imagen);
        contenedorInfo.appendChild(descripcion);
        contenedorInfo.appendChild(habilidades);
        contenedorInfo.appendChild(altura);
        contenedorInfo.appendChild(peso);
        contenedorInfo.appendChild(habitatTexto);
        contenedorInfo.appendChild(tipoTexto);

    } catch (error) {
        const mensajeError = document.createElement("p");
        mensajeError.textContent = "Pokémon no encontrado";
        mensajeError.style.color = "red";
        contenedorInfo.appendChild(mensajeError);
    }
}
