
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

  if (!aqiData || !aqiData.data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-lg text-gray-600">Unable to load pollutant data</p>
        </CardContent>
      </Card>
    );
  }

  const iaqi = aqiData.data.iaqi || {};
  
  const pollutants = [
    {
      name: "PM2.5",
      value: iaqi.pm25?.v || 0,
      unit: "AQI",
      description: "Fine particles that can penetrate deep into lungs",
      dangerLevel: (iaqi.pm25?.v || 0) > 100 ? "high" : (iaqi.pm25?.v || 0) > 50 ? "moderate" : "low",
      maxValue: 300
    },
    {
      name: "PM10",
      value: iaqi.pm10?.v || 0,
      unit: "AQI", 
      description: "Coarse particles that affect respiratory system",
      dangerLevel: (iaqi.pm10?.v || 0) > 100 ? "high" : (iaqi.pm10?.v || 0) > 50 ? "moderate" : "low",
      maxValue: 300
    },
    {
      name: "Ozone (O₃)",
      value: iaqi.o3?.v || 0,
      unit: "AQI",
      description: "Ground-level ozone that can cause breathing problems",
      dangerLevel: (iaqi.o3?.v || 0) > 100 ? "high" : (iaqi.o3?.v || 0) > 50 ? "moderate" : "low",
      maxValue: 300
    },
    {
      name: "Nitrogen Dioxide (NO₂)",
      value: iaqi.no2?.v || 0,
      unit: "AQI",
      description: "Gas from vehicle emissions and power plants",
      dangerLevel: (iaqi.no2?.v || 0) > 100 ? "high" : (iaqi.no2?.v || 0) > 50 ? "moderate" : "low",
      maxValue: 300
    },
    {
      name: "Carbon Monoxide (CO)",
      value: iaqi.co?.v || 0,
      unit: "AQI",
      description: "Colorless gas from incomplete combustion",
      dangerLevel: (iaqi.co?.v || 0) > 100 ? "high" : (iaqi.co?.v || 0) > 50 ? "moderate" : "low",
      maxValue: 300
    },
    {
      name: "Sulfur Dioxide (SO₂)",
      value: iaqi.so2?.v || 0,
      unit: "AQI",
      description: "Gas from fossil fuel burning and industrial processes",
      dangerLevel: (iaqi.so2?.v || 0) > 100 ? "high" : (iaqi.so2?.v || 0) > 50 ? "moderate" : "low",
      maxValue: 300
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Detailed Pollutant Analysis</span>
          </CardTitle>
          <p className="text-sm text-gray-600">Individual Air Quality Index values for each pollutant</p>
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
                      {pollutant.value} <span className="text-sm font-normal">{pollutant.unit}</span>
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
                    <span>{pollutant.maxValue} AQI</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AQI Scale Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-green-700 text-sm">Good</h4>
                <p className="text-xs text-green-600">0-50</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-yellow-700 text-sm">Moderate</h4>
                <p className="text-xs text-yellow-600">51-100</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-orange-700 text-sm">Unhealthy for Sensitive</h4>
                <p className="text-xs text-orange-600">101-150</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-red-700 text-sm">Unhealthy</h4>
                <p className="text-xs text-red-600">151-200</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-purple-700 text-sm">Very Unhealthy</h4>
                <p className="text-xs text-purple-600">201-300</p>
              </div>
              <div className="text-center p-3 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-900 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold text-red-900 text-sm">Hazardous</h4>
                <p className="text-xs text-red-800">300+</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollutantBreakdown;
