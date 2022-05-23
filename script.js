Vue.createApp({
    data() {
        return {
            // Config
            userName: 'nexus122', // Cambiame y la pagina cambiara entera
            onlyDemoProyects: true, // ¿Solo proyectos con demo?
            orderDateAscendent: true, // ¿Ordenar por fecha ascendente?
            // Filter Data
            searcher: '',
            // Data
            githubRepos: [],
            userInfo: []
        }
    },
    methods: {
        async fetchGithubRepos() {
            let result = await fetch(`https://api.github.com/users/${this.userName}/repos?type=all&per_page=1000`);
            this.githubRepos = await result.json();
        },
        async fetchUserInfo() {
            let result = await fetch(`https://api.github.com/users/${this.userName}`);
            this.userInfo = await result.json();
        },
        dateClick() {
            this.orderDateAscendent = !this.orderDateAscendent;
        }
    },
    mounted() {
        this.fetchGithubRepos();
        this.fetchUserInfo();
        document.title = `${this.userName} - GitHub`;
    },
    computed: {
        proyectosFiltrados() {

            let filteredProyects = this.githubRepos;

            // Arreglar los nombres que tengan guiones
            filteredProyects = filteredProyects.map(proyect => {
                if(proyect.name.includes('-')) proyect.name = proyect.name.replaceAll("-", " ");
                if(proyect.name.includes('_')) proyect.name = proyect.name.replaceAll("_", " ");

                return proyect;
            });

            

            if (this.onlyDemoProyects) {
                // Cogeremos solo los proyectos que tengan una demo definida
                filteredProyects = this.githubRepos.filter(repo => repo.homepage);
                // Nos ahorramos los proyectos que tienen una url que no cuenta con https ya que nos redirige a nuestra propia pagina.            
                filteredProyects = filteredProyects.filter(repo => repo.homepage.includes('https'));
            }

            filteredProyects = filteredProyects.filter(repo => repo.name.toLowerCase().includes(this.searcher.toLowerCase()));

            // Ordenar por update date
            if(this.orderDateAscendent) {                
                filteredProyects = filteredProyects.sort((a, b) => {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });
            }else{                
                filteredProyects = filteredProyects.sort((a, b) => {
                    return new Date(a.updated_at) - new Date(b.updated_at);
                });
            }

            return filteredProyects;
        },
    }
}).mount('#app');