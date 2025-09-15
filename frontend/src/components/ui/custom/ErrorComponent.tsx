"use client"

type Props = {
    error: string;
    errorMessage: string;
}
export default function ErrorComponent({error, errorMessage}: Props){
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-red-500/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-red-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-orange-500/40 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 text-center p-8 bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/40 rounded-2xl backdrop-blur-sm max-w-md shadow-2xl shadow-red-500/10">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
              <div className="text-2xl font-bold text-white">⚠</div>
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-red-500/30 rounded-full animate-ping"></div>
          </div>

          <div className="text-3xl font-bold text-red-400 mb-2 drop-shadow-lg">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              ERRO CRÍTICO
            </span>
          </div>
          <div className="text-lg text-red-300 mb-6 font-medium">{errorMessage}</div>
          <div className="text-sm text-red-400/80 mb-6 font-mono bg-red-900/20 p-3 rounded-lg border border-red-500/20">
            {error}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
          >
            <span className="relative z-10">TENTAR NOVAMENTE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-300/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    )
}