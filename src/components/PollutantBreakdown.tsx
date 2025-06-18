
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';

interface PollutantBreakdownProps {
  aqiData: any;
  loading: boolean;
}

const PollutantBreakdown: React.FC<PollutantBreakdownProps> = ({ aqiData, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-lg text-gray-600">Loading pollutant data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aqiData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-lg text-gray-600">Unable to load pollutant data</p>
        </CardContent>
      </Card>
    );
  }

  const components = aqiData.list[0].components;
  
  const pollutants = [
    {
      name: "PM2.5",
      value: components.pm2_5,
      unit: "μg/m³",
      description: "Fine particles that can penetrate deep into lungs",
      dangerLevel: components.pm2_5 > 35 ? "high" : components.pm2_5 > 12 ? "moderate" : "low",
      maxValue: 100
    },
    {
      name: "PM10",
      value: components.pm10,
      unit: "μg/m³", 
      description: "Coarse particles that affect respiratory system",
      dangerLevel: components.pm10 > 150 ? "high" : components.pm10 > 50 ? "moderate" : "low",
      maxValue: 200
    },
    {
      name: "Ozone (O₃)",
      value: components.o3,
      unit: "μg/m³",
      description: "Ground-level ozone that can cause breathing problems",
      dangerLevel: components.o3 > 180 ? "high" : components.o3 > 100 ? "moderate" : "low",
      maxValue: 300
    },
    {
      name: "Nitrogen Dioxide (NO₂)",
      value: components.no2,
      unit: "μg/m³",
      description: "Gas from vehicle emissions and power plants",
      dangerLevel: components.no2 > 200 ? "high" : components.no2 > 40 ? "moderate" : "low",
      maxValue: 400
    },
    {
      name: "Carbon Monoxide (CO)",
      value: components.co,
      unit: "μg/m³",
      description: "Colorless gas from incomplete combustion",
      dangerLevel: components.co > 10000 ? "high" : components.co > 4000 ? "moderate" : "low",
      maxValue: 20000
    },
    {
      name: "Sulfur Dioxide (SO₂)",
      value: components.so2,
      unit: "μg/m³",
      description: "Gas from fossil fuel burning and industrial processes",
      dangerLevel: components.so2 > 350 ? "high" : components.so2 > 125 ? "moderate" : "low",
      maxValue: 500
    }
  ];

  const getDangerColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Detailed Pollutant Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {pollutants.map((pollutant, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{pollutant.name}</h4>
                    <p className="text-sm text-gray-600">{pollutant.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {pollutant.value.toFixed(1)} <span className="text-sm font-normal">{pollutant.unit}</span>
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDangerColor(pollutant.dangerLevel)}`}>
                      {pollutant.dangerLevel.charAt(0).toUpperCase() + pollutant.dangerLevel.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={(pollutant.value / pollutant.maxValue) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{pollutant.maxValue} {pollutant.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Impact Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-green-700">Low Risk</h4>
                <p className="text-sm text-green-600">Safe for all activities</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-yellow-700">Moderate Risk</h4>
                <p className="text-sm text-yellow-600">Sensitive groups should be cautious</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-red-700">High Risk</h4>
                <p className="text-sm text-red-600">Limit outdoor exposure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollutantBreakdown;
