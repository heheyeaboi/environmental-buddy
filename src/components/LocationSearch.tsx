
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSearchProps {
  currentLocation: { lat: number; lon: number; name: string };
  onLocationChange: (location: { lat: number; lon: number; name: string }) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ currentLocation, onLocationChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const AQI_API_KEY = "ed3812cc51328f7ab94d15bceb7ae9cc61f93c15";

  const searchLocations = async (query: string) => {
    if (query.length < 2) return;
    
    setIsSearching(true);
    try {
      // First try to search by city name using aqicn.org search
      const response = await fetch(
        `https://api.waqi.info/search/?token=${AQI_API_KEY}&keyword=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (data.status === "ok" && data.data) {
        setSearchResults(data.data.slice(0, 5)); // Limit to 5 results
        setShowResults(true);
        console.log("Search results from aqicn.org:", data.data);
      } else {
        // Fallback to OpenWeatherMap geocoding if aqicn search fails
        const fallbackResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=ed3812cc51328f7ab94d15bceb7ae9cc61f93c15`
        );
        const fallbackData = await fallbackResponse.json();
        
        // Transform OpenWeatherMap results to match our format
        const transformedResults = fallbackData.map((item: any) => ({
          station: {
            name: `${item.name}, ${item.country}`,
            geo: [item.lat, item.lon]
          }
        }));
        
        setSearchResults(transformedResults);
        setShowResults(true);
        console.log("Fallback search results:", transformedResults);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      toast({
        title: "Search Error",
        description: "Unable to search locations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocations(searchQuery);
  };

  const selectLocation = (location: any) => {
    let newLocation;
    
    if (location.station) {
      // aqicn.org format
      newLocation = {
        lat: location.station.geo[0],
        lon: location.station.geo[1],
        name: location.station.name
      };
    } else {
      // Fallback format or saved location
      newLocation = {
        lat: location.lat,
        lon: location.lon,
        name: location.name
      };
    }
    
    onLocationChange(newLocation);
    setShowResults(false);
    setSearchQuery('');
    toast({
      title: "Location Updated",
      description: `Now showing data for ${newLocation.name}`,
    });
  };

  const savedLocations = [
    { name: "New York, US", lat: 40.7128, lon: -74.0060 },
    { name: "London, UK", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo, JP", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney, AU", lat: -33.8688, lon: 151.2093 },
    { name: "Beijing, CN", lat: 39.9042, lon: 116.4074 },
    { name: "Delhi, IN", lat: 28.7041, lon: 77.1025 }
  ];

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "..." : "Search"}
        </Button>
      </form>

      {/* Search Results */}
      {showResults && (
        <Card className="absolute top-full mt-2 w-full z-20 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((location: any, index) => (
                  <button
                    key={index}
                    onClick={() => selectLocation(location)}
                    className="w-full text-left p-3 hover:bg-gray-100 rounded-md flex items-center space-x-3"
                  >
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{location.station?.name || location.name}</p>
                      {location.station?.geo && (
                        <p className="text-sm text-gray-500">
                          Lat: {location.station.geo[0].toFixed(4)}, Lon: {location.station.geo[1].toFixed(4)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No locations found</p>
            )}
            
            {/* Saved Locations */}
            <div className="border-t mt-4 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Popular Locations
              </p>
              <div className="space-y-1">
                {savedLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => selectLocation(location)}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded-md flex items-center space-x-3"
                  >
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{location.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;
