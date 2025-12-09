import { useState } from "react";
import { Droplets } from "lucide-react";

export default function WaterLevelCylinder() {
  const [waterLevel, setWaterLevel] = useState(65);

  const getWaterColor = (level) => {
    if (level < 30) return "from-red-400 to-red-600";
    if (level < 60) return "from-yellow-400 to-yellow-600";
    return "from-blue-400 to-blue-600";
  };

  const getStatusText = (level) => {
    if (level < 30) return { text: "Low", color: "text-red-600" };
    if (level < 60) return { text: "Medium", color: "text-yellow-600" };
    return { text: "Good", color: "text-blue-600" };
  };

  const status = getStatusText(waterLevel);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplets className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              Water Level Monitor
            </h1>
          </div>
          <p className="text-gray-400">Real-time tank water level</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl">
          {/* Cylindrical Container */}
          <div
            className="relative mx-auto"
            style={{ width: "200px", height: "300px" }}
          >
            {/* Top Ellipse */}
            <div
              className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-full border-2 border-slate-500 z-10"
              style={{
                borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
                boxShadow: "inset 0 -2px 8px rgba(0,0,0,0.3)",
              }}
            ></div>

            {/* Cylinder Body - Background */}
            <div className="absolute top-4 left-0 right-0 bottom-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-x-2 border-slate-500">
              {/* Inner shadow for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            </div>

            {/* Water Fill */}
            <div
              className="absolute left-0 right-0 bottom-4 transition-all duration-1000 ease-out overflow-hidden"
              style={{
                height: `${waterLevel}%`,
                maxHeight: "calc(100% - 32px)",
              }}
            >
              {/* Water body */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getWaterColor(
                  waterLevel
                )}`}
              >
                {/* Water shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {/* Animated waves */}
                <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden">
                  <div
                    className="absolute inset-0 animate-wave bg-gradient-to-b from-white/30 to-transparent"
                    style={{
                      animation: "wave 3s ease-in-out infinite",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom Ellipse */}
            <div
              className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-full border-2 border-slate-500"
              style={{
                borderRadius: "0 0 50% 50% / 0 0 20% 20%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            ></div>

            {/* Measurement markers */}
            <div className="absolute top-4 -left-8 bottom-4 flex flex-col justify-between text-xs text-gray-400">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Water level percentage indicator */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-white">
                  {waterLevel}%
                </div>
                <div className={`text-sm font-medium ${status.color}`}>
                  {status.text}
                </div>
              </div>
            </div>
          </div>

          {/* Control Slider */}
          {/* <div className="mt-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Adjust Water Level
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={waterLevel}
              onChange={(e) => setWaterLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Empty</span>
              <span>Full</span>
            </div>
          </div> */}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xs text-gray-400 mb-1">Capacity</div>
              <div className="text-lg font-semibold text-white">1000L</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xs text-gray-400 mb-1">Current</div>
              <div className="text-lg font-semibold text-white">
                {waterLevel * 10}L
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes wave {
            0%, 100% {
              transform: translateX(-25%) translateY(0);
            }
            50% {
              transform: translateX(0) translateY(-5px);
            }
          }
          
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
}
