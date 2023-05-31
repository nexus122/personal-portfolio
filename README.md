# Github Auto-Portfolio
Portfolio Generico que depende directamente de Github, carga la información de tu usuario y los proyectos que tengas dentro.
Puedes escoger mostrar solo los proyectos que tengan una demo a modo de filtro.

## Screen Shoot
![image](https://user-images.githubusercontent.com/22988550/167912033-c47315c0-1aa8-4c49-a643-07e541ac6000.png)

## ¿Como Usarlo?
¿Quieres utilizar este portfolio con tu perfil?
No hay problema, en el apartado script.js encontraras el codigo que tienes aqui abajo, en la variable userName coloca tu nombre de github sin el @, en la variable onlyDemoProyects decide si quieres que se muestren todos los proyectos de github o solo los que tienen una demo publicada.
```` javascript
data() {
        return {
            // Config
            userName: 'TU USUARIO', // Escribe tu nombre de github ( sin el @)
            onlyDemoProyects: true | false, // ¿Solo proyectos con demo? true con demo, false sin demo
            
            // De esto no hace falta tocar nada
            // Filter Data
            searcher: '',
            // Data
            githubRepos: [],
            userInfo: []
        }
    }
````

### ¿Como hago para que un proyecto tenga demo?
Para hacer que un proyecto "tenga demo" asegurate de que en la columna derecha, donde apunta la flecha tengas un enlace a la demo del proyecto

![Instrucciones_1](https://i.ibb.co/0Gp5npd/Screenshot-1.png)

Si nunca lo has hecho, sigue estos pasos:
- 1 dale al ⚙️ engranaje de la columna derecha que has visto en la imagen
- 2 escribe un enlace a la demo de tu proyecto en el hueco website como veras en la imagen y guarda los cambios.
![Website Instucciones](https://i.ibb.co/LhNJzbV/Screenshot-2.png)

## Tecnologias
html, css, javascript, vue.js

## Hecho
- [x] Introducir los proyectos que tengo en github con githubPage.
- [x] Crear la estructura del proyecto.

## Por hacer
- [ ] Crear temas de color para que se pueda personalizar.
- [ ] Aplicar filtros segun tecnologías.

## Ideas
 - Filtros para buscar por tecnologias
 - Imagenes del proyecto
