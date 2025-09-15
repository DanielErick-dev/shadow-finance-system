// Em: src/lib/audio.ts

class AudioService {
    private static instance: AudioService;
    private sounds: Record<string, HTMLAudioElement> = {};
    private isBrowser: boolean; // Variável para saber se estamos no navegador

    private constructor() {
        // 1. Verificamos se estamos no ambiente do navegador
        this.isBrowser = typeof window !== 'undefined';
        
        // 2. Só pré-carregamos os sons se estivermos no navegador
        if (this.isBrowser) {
            this.preloadSounds();
        }
    }

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private preloadSounds() {
        // Esta função agora é segura, pois só é chamada no navegador
        this.sounds['ergase'] = new Audio('/sounds/ergase.mp3');
        
        Object.values(this.sounds).forEach(audio => {
            audio.preload = 'auto';
        });
    }

    public play(sound: string, volume = 0.7): void {
        // 3. Adicionamos uma guarda de segurança aqui também.
        // Se, por algum motivo, `play` for chamado no servidor, ele não fará nada e não quebrará.
        if (!this.isBrowser) {
            console.log("AudioService: Tentativa de tocar som no ambiente de servidor. Ignorando.");
            return;
        }

        const audio = this.sounds[sound];
        if (audio) {
            audio.volume = volume;
            audio.currentTime = 0; // Reinicia o áudio
            
            // O `play()` retorna uma Promise, é uma boa prática tratar o erro dela.
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Navegadores podem bloquear autoplay se o usuário não interagiu com a página primeiro.
                    console.error(`Erro ao tocar o som '${sound}':`, error);
                });
            }
        }
    }
}

// A instância é criada aqui, mas o construtor agora é seguro para rodar no servidor
export const audioService = AudioService.getInstance();

