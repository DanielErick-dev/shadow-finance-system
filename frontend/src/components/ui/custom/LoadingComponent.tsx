"use client"

type Props = {
    text: string;
}
export default function LoadingComponent({text}: Props){
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-500/40 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-500/20 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 border-2 border-slate-800 rounded-full"></div>
            <div className="absolute w-20 h-20 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin shadow-lg shadow-purple-500/20"></div>
            <div
              className="absolute w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin shadow-lg shadow-blue-500/20"
              style={{ animationDelay: "0.15s", animationDirection: "reverse" }}
            ></div>
            <div
              className="absolute w-12 h-12 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"
              style={{ animationDelay: "0.3s" }}
            ></div>

            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse mb-2">
              <span className="drop-shadow-lg">{text}</span>
            </div>
            <div className="text-sm text-slate-400 animate-pulse">
              <span className="inline-block animate-bounce" style={{ animationDelay: "0s" }}>
                .
              </span>
              <span className="inline-block animate-bounce" style={{ animationDelay: "0.1s" }}>
                .
              </span>
              <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>
                .
              </span>
            </div>

            <div className="mt-4 w-48 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse shadow-sm shadow-purple-500/30"></div>
            </div>
          </div>
        </div>
      </div>
    )
}