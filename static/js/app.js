const { createApp, ref, reactive, onMounted, computed } = Vue;

createApp({
    setup() {
        // ===== Site config =====
        const site = reactive({
            name: 'Sherrie Liang',
            brand: 'SL',
            slogan: 'Designing Human-centered AI solutions that ship to production'
        });

        // ===== Navigation =====
        const navLinks = ref([
            { id: 'about', title: 'About' },
            { id: 'skills', title: 'Skills' },
            { id: 'projects', title: 'Projects' },
            { id: 'experience', title: 'Experience' },
            { id: 'contact', title: 'Contact' }
        ]);

        // ===== Menu open state =====
        const menuOpen = ref(false);

        // ===== Profile =====
        const profile = reactive({
            name: 'Sherrie Liang',
            avatar: 'static/img/avatar.jpeg',
            title: 'AI Solution Architect',
            bio: 'Bridging business goals and engineering — from AI agents orchestration and RAG pipelines to AI deployment.'
        });

        // ===== Social links =====
        const socialLinks = ref([
            { name: 'Google Scholar', icon: 'ri-graduation-cap-fill', url: 'https://scholar.google.com/citations?user=-6BwIkQAAAAJ&hl=en' },
            { name: 'GitHub', icon: 'ri-github-fill', url: 'https://github.com/s2liang' },
            { name: 'LinkedIn', icon: 'ri-linkedin-fill', url: 'https://www.linkedin.com/in/sherrie-liang' },
            { name: 'Email', icon: 'ri-mail-fill', url: 'mailto:sherryliang23@outlook.com' }
        ]);

        // ===== About =====
        const about = reactive({
            intro: 'Hello, I\'m Xiaoyun, but I go by Sherrie. AI Solution Architect with a Ph.D. and a focus on end-to-end solution design: discovery and requirements, architecture strategies, proof-of-concepts, production rollout, scalability and secure.',

            // intro: 'AI Solution Architect with a focus on end-to-end solution design: discovery and requirements, reference architectures, proof-of-concepts, and production rollout. Experienced aligning stakeholders, data platforms, and engineering teams around measurable outcomes for generative AI and intelligent automation.',
            cards: [
                { icon: 'ri-stack-fill', title: 'Architect', desc: 'Engineer solution design leveraging deep AI agent expertise, cloud AI platforms, pipelines' },
                { icon: 'ri-git-merge-fill', title: 'Integrator', desc: 'Weave AI into real workflows and bridging technical systems for real-world problems' },
                { icon: 'ri-rocket-2-fill', title: 'Enabler', desc: 'Provide consulting services for non-tech stakeholders and turn discovery into action' },
            ]
        });

        // ===== Skills =====
        const skills = ref([
            { name: 'Solution Architecture', level: 'advanced' },
            { name: 'Agentic Workflows', level: 'advanced' },
            { name: 'API Integration', level: 'advanced' },
            { name: 'Stateholder Consulting', level: 'advanced' },

            { name: 'OpenAI APIs', level: 'advanced' },
            // { name: 'LLMs&Prompting', level: 'advanced' },
            { name: 'Python', level: 'advanced' },
            { name: 'Agentic-AI&Orchestration', level: 'advanced' },
            { name: 'Multi-modal AI', level: 'intermediate' },
            // { name: 'Model Evaluation', level: 'intermediate' },
            { name: 'Proof of Concept', level: 'intermediate' },
            { name: 'AWS&Azure AI', level: 'intermediate' },
            { name: 'LangChain', level: 'basic' },
            { name: 'Docker/Hugging Face/Git', level: 'basic' },
            { name: 'RAG', level: 'basic' }
        ]);

        // ===== Projects =====
        const projects = ref([
            {
                title: 'Patient Digital Twin - AI Consulting Services',
                desc: 'Client had over 4k+ data samples for screening potential Patellofemoral pain (PFP) groups. Supported on designing AI models, deliverying actional plans, and engineering deployable AI tools.  ',
                tags: ['AI Consulting', 'Solution Architect', 'Data Science', 'Python'],
                link: 'https://faculty.lsu.edu/hkimlab/research.php',
                image: 'static/img/project01.jpeg',
                metrics: [
                    { label: 'In-progress project; Code will ba avaiable online. A literature review manuscript was submitted to the journal: Gaint \& Posture.', url:'https://www.sciencedirect.com/journal/gait-and-posture' }
                ]
            },
            {
                title: 'Trialpilot: Autonomous AI Agent for Clinical Studies',
                desc: 'Client managed 3+ projects with over 600+ patients without decision intelligence. Designed and currently developing an AI agent tool for automation, targeting reduction of operation time by 40%. ',
                tags: ['LangChain', 'Agentic Workflow', 'RAG', 'GenAIops', 'AI Agent'],
                link: 'https://faculty.lsu.edu/habit-lab/ongoing-projects.php',
                image: 'static/img/project02.png',
                metrics: [
                    { label: 'In-progress project; Demo comming soon.' },
                ]
            },
            {
                icon: 'ri-award-fill',
                title: 'Agentic AI Framework in Robot-assisted Work',
                desc: 'Cobots lacked accessibility for workers. Orchestrated multi-step agents for reasoning, object recognition, and execution - increasing effectiveness by 40% and cutting task completion time by 30%.',
                tags: ['AI Agents', 'Prompt Engineering', 'LLMs', 'Eyetracker', 'Ollama'],
                link: 'https://doi.org/10.3390/s26061958',
                image: 'static/img/project03.jpeg',
                metrics: [
                    { label: 'Featured on Journal\'s COVER PAGE', url: 'https://www.mdpi.com/1424-8220/26/6',},
                    { label: 'Demo can be found here', icon: 'ri-play-fill', url: 'https://drive.google.com/file/d/1RuvRYgOdMxjIolJYRF7_Mv1OOBUt2UCl/view?usp=drive_link' }
                ]
            },
            {
                title: 'Deep Learning Model for Real-Time Motion Prediction',
                desc: 'Precise human motion prediction ensures safety in robot operations. Developed a deep-learning model framework and implemented it in a handover task, resulting improved overall performance by around 8%.',
                tags: ['MLOps','LSTM', 'Transformers', 'Model Training', 'Data Science'],
                link: 'https://doi.org/10.1016/j.aei.2025.103591',
                image: 'static/img/project04.jpeg',
                metrics: [
                    { label: 'Code is available on GitHub (managed by AICon Lab)', icon: 'ri-github-fill', url: 'https://github.com/AIConLab/hrc-human-motion' }
                ]
            }
        ]);

        // ===== Experience =====
        const experience = ref([
            { date: '2026 - ██', title: 'AI Solution Architect', company: 'Research Consultant', desc: 'Advise academic researchers on AI adoption strategies, translating complex research needs into actionable solutions — from selecting optimal data analysis frameworks to developing targeted AI tools that streamlined research operations.' },
            { date: '2021 - 2025', title: 'Research Assistant/Engineering', company: 'Educatoin & Early Career', desc: 'Researched AI practability in collaborative robots and the construction industry; Delivered AI-powered prototypes, data products, and integration patterns; all that inform today\'s AI solution design.' },
            { date: '2014 - 2020', title: 'Architectual Engineering', company: 'Education', desc: 'Built strong fundamentals in data, programming, and the ability to break down complex problems into manageable solutions — the base for designing reliable AI solutions at scale.' }
        ]);

        // ===== Stats =====
        const stats = ref([
            { value: 'AI', label: 'Solution focus' },
            { value: 'End-to-End', label: 'Solution delivery' },
            { value: 'Cloud', label: 'Platform delivery' },
            { value: (new Date().getFullYear() - 2021)+'+', label: 'Years Experience' }
        ]);

        // ===== Resource links =====
        const resourceLinks = ref([
            { name: 'Codex', icon: 'ri-openai-fill', url: 'https://chatgpt.com/codex/', desc: 'Cloud AI for Work' },
            { name: 'AWS Academy', icon: 'ri-cloud-fill', url: 'https://aws.amazon.com/training/awsacademy/', desc: 'Learning Hub on AWS AI' },
            { name: 'Awesome Agent Skills', icon: 'ri-github-fill', url: 'https://github.com/VoltAgent/awesome-agent-skills', desc: 'Code & AI agents' }
        ]);

        // ===== Dynamic data =====
        const typedText = ref('');
        const currentYear = computed(() => new Date().getFullYear());

        // ===== Visible sections =====
        const visibleSections = reactive({
            about: false, skills: false, projects: false,
            experience: false, stats: false, poetry: false, links: false
        });

        // ===== Typewriter =====
        const typeWriter = () => {
            const texts = ['Sherrie Liang', 'From idea to production', 'Intelligent · Secure · Scalable'];
            let textIndex = 0, charIndex = 0, isDeleting = false;

            const type = () => {
                const current = texts[textIndex];
                typedText.value = isDeleting ? current.substring(0, --charIndex) : current.substring(0, ++charIndex);

                if (!isDeleting && charIndex === current.length) {
                    setTimeout(type, 2000);
                    isDeleting = true;
                    return;
                }
                if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                }
                setTimeout(type, isDeleting ? 35 : 75);
            };
            type();
        };

        // ===== Particles =====
        const initParticles = () => {
            if (window.FluidBackground) {
                window.FluidBackground.init('particles');
            }
        };

        // ===== Scroll observer =====
        const initScrollObserver = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.id;
                    if (id && visibleSections.hasOwnProperty(id)) {
                        visibleSections[id] = entry.isIntersecting;
                    }
                });
            }, { threshold: 0.15 });

            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });
        };

        // ===== External data =====
        const loadExternalData = () => {
            const bs = document.createElement('script');
            bs.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
            bs.async = true;
            document.body.appendChild(bs);
        };

        onMounted(() => {
            typeWriter();
            initParticles();
            initScrollObserver();
            loadExternalData();

            document.addEventListener('visibilitychange', () => {
                document.title = document.hidden ? 'SL | Come back 👋' : `${site.name} | AI Solution Architect`;
            });

            console.log(`%c⚡ ${site.name} — AI Solution Architect`, 'color:#58a6ff;font-size:16px;font-weight:bold');
        });

        return {
            site, navLinks, profile, socialLinks, about, skills, projects,
            experience, stats, resourceLinks, typedText, currentYear, visibleSections, menuOpen
        };
    }
}).mount('#app');