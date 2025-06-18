
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AQIDisplayProps {
  aqiData: any;
  location: { lat: number; lon: number; name: string };
  loading: boolean;
}

const AQIDisplay: React.FC<AQIDisplayProps> = ({ aqiData, location, loading }) => {
  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { level: "Good", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" };
    if (aqi <= 100) return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" };
    if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" };
    if (aqi <= 200) return { level: "Unhealthy", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" };
    if (aqi <= 300) return { level: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50" };
    return { level: "Hazardous", color: "bg-red-900", textColor: "text-red-900", bgColor: "bg-red-100" };
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50) return "Air quality is good. Ideal for outdoor activities.";
    if (aqi <= 100) return "Air quality is acceptable for most people.";
    if (aqi <= 150) return "Sensitive individuals should limit outdoor activities.";
    if (aqi <= 200) return "Everyone should limit outdoor activities.";
    if (aqi <= 300) return "Health warnings. Everyone should avoid outdoor activities.";
    return "Emergency conditions. Everyone should avoid all outdoor activities.";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-lg text-gray-600">Loading air quality data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aqiData || !aqiData.data) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <p className="text-lg text-gray-600">Unable to load air quality data</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const aqi = aqiData.data.aqi;
  const aqiInfo = getAQILevel(aqi);
  const cityName = aqiData.data.city?.name || location.name;
  const updateTime = aqiData.data.time?.s ? new Date(aqiData.data.time.s).toLocaleTimeString() : "Now";

  return (
    <Card className={`w-full ${aqiInfo.bgColor} border-2`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">{cityName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{updateTime}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full ${aqiInfo.color} flex items-center justify-center mb-3`}>
                <span className="text-3xl font-bold text-white">{aqi}</span>
              </div>
              <p className={`text-sm font-medium ${aqiInfo.textColor}`}>AQI Level</p>
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold ${aqiInfo.textColor} mb-2`}>{aqiInfo.level}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{getAQIDescription(aqi)}</p>
            </div>
          </div>
        </div>
        
        {/* Additional AQI Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded mb-1"></div>
              <span className="text-gray-600">Good</span>
              <span className="font-medium">0-50</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mb-1"></div>
              <span className="text-gray-600">Moderate</span>
              <span className="font-medium">51-100</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mb-1"></div>
              <span className="text-gray-600">Unhealthy</span>
              <span className="font-medium">101-150</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded mb-1"></div>
              <span className="text-gray-600">Unhealthy</span>
              <span className="font-medium">151-200</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mb-1"></div>
              <span className="text-gray-600">V.Unhealthy</span>
              <span className="font-medium">201-300</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-900 rounded mb-1"></div>
              <span className="text-gray-600">Hazardous</span>
              <span className="font-medium">300+</span>
            </div>
          </div>
        </div>

        {/* Data Source Attribution */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Data provided by AQICN.org - World Air Quality Index Project
        </div>
      </CardContent>
    </Card>
  );
};

export default AQIDisplay;
