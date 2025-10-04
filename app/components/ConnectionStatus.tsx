interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string | null;
}

export default function ConnectionStatus({ isConnected, error }: ConnectionStatusProps) {
  return (
    <div className="fixed top-8 right-8 z-50">
      <div
        className={`flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
          isConnected
            ? 'bg-green-500/90 text-white'
            : error
            ? 'bg-red-500/90 text-white'
            : 'bg-yellow-500/90 text-white'
        }`}
      >
        <div className="relative">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-white' : 'bg-white/70'
            }`}
          />
          {isConnected && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-white animate-ping" />
          )}
        </div>
        <span className="font-semibold text-lg">
          {isConnected ? 'Connected' : error ? 'Connection Error' : 'Connecting...'}
        </span>
      </div>
    </div>
  );
}

