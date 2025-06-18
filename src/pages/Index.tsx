
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Wind, Eye, Thermometer, Activity, Bell, Heart, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AQIDisplay from '@/components/AQIDisplay';
import LocationSearch from '@/components/LocationSearch';
import PollutantBreakdown from '@/components/PollutantBreakdown';
import NewsSection from '@/components/NewsSection';
import HealthRecommendations from '@/components/HealthRecommendations';
import AlertsSection from '@/components/AlertsSection';

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lon: -74.0060, name: "New York, NY" });
  const [aqiData, setAqiData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_KEY = "ed3812cc51328f7ab94d15bceb7ae9cc61f93c15";

  useEffect(() => {
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: "Current Location"
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          toast({
            title: "Location Access",
            description: "Using default location. Enable location services for personalized data.",
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchAirQualityData();
    fetchWeatherData();
  }, [currentLocation]);

  const fetchAirQualityData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.cod && data.cod !== 200) {
        console.error("AQI API Error:", data);
        toast({
          title: "API Error",
          description: "Invalid API key or service unavailable. Using demo data.",
          variant: "destructive"
        });
        // Set demo data for AQI
        setAqiData({
          list: [{
            main: { aqi: 2 },
            components: {
              pm2_5: 15.2,
              pm10: 25.8,
              o3: 85.4,
              no2: 22.1,
              so2: 5.3,
              co: 0.8
            }
          }]
        });
      } else {
        setAqiData(data);
      }
      console.log("AQI Data:", data);
    } catch (error) {
      console.error("Error fetching AQI data:", error);
      toast({
        title: "Data Error",
        description: "Unable to fetch air quality data. Using demo data.",
        variant: "destructive"
      });
      // Set demo data for AQI
      setAqiData({
        list: [{
          main: { aqi: 2 },
          components: {
            pm2_5: 15.2,
            pm10: 25.8,
            o3: 85.4,
            no2: 22.1,
            so2: 5.3,
            co: 0.8
          }
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod && data.cod !== 200) {
        console.error("Weather API Error:", data);
        // Set demo weather data
        setWeatherData({
          main: {
            temp: 22,
            humidity: 65
          },
          wind: {
            speed: 3.2
          },
          visibility: 8000
        });
      } else {
        setWeatherData(data);
      }
      console.log("Weather Data:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Set demo weather data
      setWeatherData({
        main: {
          temp: 22,
          humidity: 65
        },
        wind: {
          speed: 3.2
        },
        visibility: 8000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wind className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AirWatch Pro</h1>
                <p className="text-sm text-gray-500">Real-time Air Quality Monitor</p>
              </div>
            </div>
            <LocationSearch 
              currentLocation={currentLocation}
              onLocationChange={setCurrentLocation}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">News</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Current AQI Display */}
              <AQIDisplay aqiData={aqiData} location={currentLocation} loading={loading} />
              
              {/* Weather Stats */}
              {weatherData && weatherData.main && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{Math.round(weatherData.main.temp)}°C</p>
                      <p className="text-sm text-gray-500">Temperature</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Wind className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.wind?.speed || 0}</p>
                      <p className="text-sm text-gray-500">Wind (m/s)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.main.humidity}%</p>
                      <p className="text-sm text-gray-500">Humidity</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{weatherData.visibility ? (weatherData.visibility/1000).toFixed(1) : 'N/A'}</p>
                      <p className="text-sm text-gray-500">Visibility (km)</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="monitor">
            <PollutantBreakdown aqiData={aqiData} loading={loading} />
          </TabsContent>

          <TabsContent value="news">
            <NewsSection />
          </TabsContent>

          <TabsContent value="health">
            <HealthRecommendations aqiData={aqiData} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
