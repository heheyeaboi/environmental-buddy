
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
    if (aqi === 1) return { level: "Good", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" };
    if (aqi === 2) return { level: "Fair", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" };
    if (aqi === 3) return { level: "Moderate", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" };
    if (aqi === 4) return { level: "Poor", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" };
    if (aqi === 5) return { level: "Very Poor", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50" };
    return { level: "Unknown", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" };
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi === 1) return "Air quality is good. Ideal for outdoor activities.";
    if (aqi === 2) return "Air quality is acceptable for most people.";
    if (aqi === 3) return "Sensitive individuals should limit outdoor activities.";
    if (aqi === 4) return "Everyone should limit outdoor activities.";
    if (aqi === 5) return "Health warnings. Everyone should avoid outdoor activities.";
    return "Air quality data unavailable.";
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

  if (!aqiData) {
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

  const aqi = aqiData.list[0].main.aqi;
  const aqiInfo = getAQILevel(aqi);

  return (
    <Card className={`w-full ${aqiInfo.bgColor} border-2`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">{location.name}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Now</span>
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
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600">Good</span>
              <span className="text-xs font-medium">1</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600">Fair</span>
              <span className="text-xs font-medium">2</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600">Moderate</span>
              <span className="text-xs font-medium">3</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600">Poor</span>
              <span className="text-xs font-medium">4</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600">Very Poor</span>
              <span className="text-xs font-medium">5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AQIDisplay;
