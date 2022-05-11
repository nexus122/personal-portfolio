Vue.createApp({
    data() {
        return {
            // Config
            userName: 'nexus122', // Cambiame y la pagina cambiara entera
            onlyDemoProyects: true, // ¿Solo proyectos con demo?            
            // Filter Data
            searcher: '',
            orderDateAscendent: true,
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

            // Transformar titulo
            filteredProyects = filteredProyects.map(proyect => {
                proyect.name = proyect.name.replaceAll("-", " ");
                proyect.name = proyect.name.replaceAll("_", " ");
                return proyect.name;
            });

            // Ordenamos los proyectos por fecha
            filteredProyects = filteredProyects.sort((a, b) => {
                if (this.orderDateAscendent) 
                    return new Date(b.updated_at) - new Date(a.updated_at);
                else 
                    return new Date(a.updated_at) - new Date(b.updated_at);
            });

            // Damos a elegir al usuario si quiere o no los proyectos con demo.            
            if (this.onlyDemoProyects) {
                // Cogeremos solo los proyectos que tengan una demo definida
                filteredProyects = this.githubRepos.filter(repo => repo.homepage);
                // Nos ahorramos los proyectos que tienen una url que no cuenta con https ya que nos redirige a nuestra propia pagina.            
                filteredProyects = filteredProyects.filter(repo => repo.homepage.includes('https'));
            }

            filteredProyects = filteredProyects.filter(repo => repo.name.toLowerCase().includes(this.searcher.toLowerCase()));

            return filteredProyects;
        },
    }
}).mount('#app')