Vue.createApp({
    data() {
        return {
            // Config
            userName: 'nexus122', // Cambiame y la pagina cambiara entera            
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
        }
    },
    mounted() {
        this.fetchGithubRepos();
        this.fetchUserInfo();        
    },
    computed:{
        proyectosConPagina(){
            return this.githubRepos.filter(repo => repo.homepage);
        },
    }
}).mount('#app')