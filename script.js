Vue.createApp({
    data() {
        return {
            // Config
            userName: 'nexus122', // Cambiame y la pagina cambiara entera
            onlyDemoProyects: true, // ¿Solo proyectos con demo?
            orderDateAscendent: true, // ¿Ordenar por fecha ascendente?
            isDarkTheme: true,
            // Filter Data
            searcher: '',
            selectedTopics: [],
            // Data
            githubRepos: [],
            isLoading: false,
            fetchError: null,
            userInfo: {}
        }
    },
    methods: {
        async fetchGithubRepos() {
            this.isLoading = true;
            this.fetchError = null;
            const CACHE_KEY = `gh_repos_${this.userName}`;
            const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (cached && Date.now() - cached.ts < CACHE_TTL) {
                this.githubRepos = cached.data;
                this.isLoading = false;
                return;
            }
            try {
                let page = 1;
                const perPage = 100;
                let allRepos = [];
                while (true) {
                    const result = await fetch(`https://api.github.com/users/${this.userName}/repos?type=all&per_page=${perPage}&page=${page}`);
                    if (!result.ok) throw new Error(`GitHub API error ${result.status}`);
                    const repos = await result.json();
                    allRepos = allRepos.concat(repos);
                    if (repos.length < perPage) break;
                    page++;
                }
                this.githubRepos = allRepos;
                localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: allRepos }));
            } catch (error) {
                this.fetchError = error;
            } finally {
                this.isLoading = false;
            }
        },
        async fetchUserInfo() {
            try {
                const result = await fetch(`https://api.github.com/users/${this.userName}`);
                if (!result.ok) throw new Error(`GitHub API error ${result.status}`);
                this.userInfo = await result.json();
            } catch (error) {
                this.fetchError = error;
            }
        },
        dateClick() {
            this.orderDateAscendent = !this.orderDateAscendent;
        },
        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            const theme = this.isDarkTheme ? 'dark' : 'light';
            document.documentElement.className = theme;
            localStorage.setItem('portfolio-theme', theme);
        },
        toggleTopic(topic) {
            const idx = this.selectedTopics.indexOf(topic);
            if (idx > -1) this.selectedTopics.splice(idx, 1);
            else this.selectedTopics.push(topic);
        }
    },
    mounted() {
        // Sync Vue state with the theme already applied by the inline script
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
        }
        this.fetchGithubRepos();
        this.fetchUserInfo();
        document.title = `${this.userName} — Portfolio`;
    },
    computed: {
        availableTopics() {
            const allTopics = this.githubRepos.flatMap(repo => repo.topics || []);
            return [...new Set(allTopics)].sort();
        },
        proyectosFiltrados() {

            let filteredProyects = this.githubRepos;

            // Arreglar los nombres que tengan guiones (non-mutating: spread into new object)
            filteredProyects = filteredProyects.map(proyect => {
                let displayName = proyect.name;
                if (displayName.includes('-')) displayName = displayName.replaceAll("-", " ");
                if (displayName.includes('_')) displayName = displayName.replaceAll("_", " ");
                return { ...proyect, name: displayName };
            });



            if (this.onlyDemoProyects) {
                // Cogeremos solo los proyectos que tengan una demo definida
                filteredProyects = filteredProyects.filter(repo => repo.homepage);
                // Nos ahorramos los proyectos que tienen una url que no cuenta con https ya que nos redirige a nuestra propia pagina.            
                filteredProyects = filteredProyects.filter(repo => repo.homepage.includes('https'));
            }

            filteredProyects = filteredProyects.filter(repo => repo.name.toLowerCase().includes(this.searcher.toLowerCase()));

            if (this.selectedTopics.length > 0) {
                filteredProyects = filteredProyects.filter(repo =>
                    (repo.topics || []).some(t => this.selectedTopics.includes(t))
                );
            }

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