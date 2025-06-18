
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Activity, Shield, AlertTriangle, Clock, Users } from 'lucide-react';

interface HealthRecommendationsProps {
  aqiData: any;
}

const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ aqiData }) => {
  const [userProfile, setUserProfile] = useState({
    hasAsthma: false,
    hasHeartCondition: false,
    ageGroup: 'adult',
    activityLevel: 'moderate'
  });

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getHealthRecommendations = (aqi: number) => {
    const recommendations = {
      outdoor: [],
      indoor: [],
      protective: [],
      vulnerable: []
    };

    if (aqi <= 50) {
      recommendations.outdoor.push("Perfect for all outdoor activities including running, cycling, and sports");
      recommendations.outdoor.push("Great time for walks in the park or outdoor exercise");
      recommendations.indoor.push("Consider opening windows for fresh air circulation");
      recommendations.protective.push("No special protective measures needed");
    } else if (aqi <= 100) {
      recommendations.outdoor.push("Good for most outdoor activities with normal precautions");
      recommendations.outdoor.push("Ideal for moderate exercise like walking or light jogging");
      recommendations.indoor.push("Safe to open windows for ventilation");
      recommendations.protective.push("Sensitive individuals should monitor symptoms");
    } else if (aqi <= 150) {
      recommendations.outdoor.push("Limit prolonged outdoor exertion, especially for sensitive groups");
      recommendations.outdoor.push("Choose indoor activities during peak pollution hours");
      recommendations.indoor.push("Keep windows closed during high traffic times");
      recommendations.protective.push("Consider wearing a mask if you're sensitive to air pollution");
      recommendations.vulnerable.push("Children and elderly should reduce outdoor time");
    } else if (aqi <= 200) {
      recommendations.outdoor.push("Avoid outdoor exercise and limit time outside");
      recommendations.outdoor.push("If you must go outside, limit to essential activities only");
      recommendations.indoor.push("Keep windows and doors closed");
      recommendations.indoor.push("Use air purifiers if available");
      recommendations.protective.push("Wear N95 or equivalent masks when outside");
      recommendations.vulnerable.push("Everyone should limit outdoor activities");
    } else {
      recommendations.outdoor.push("Stay indoors as much as possible");
      recommendations.outdoor.push("Avoid all outdoor physical activities");
      recommendations.indoor.push("Seal gaps around doors and windows");
      recommendations.indoor.push("Run air purifiers on high settings");
      recommendations.protective.push("Wear high-quality masks (N95/N99) when outdoors");
      recommendations.vulnerable.push("Seek medical attention if experiencing breathing difficulties");
    }

    return recommendations;
  };

  const getBestTimes = (aqi: number) => {
    if (aqi <= 100) {
      return ["Early morning (6-8 AM)", "Late evening (7-9 PM)", "Most of the day is suitable"];
    } else if (aqi <= 150) {
      return ["Early morning before 8 AM", "After 8 PM when traffic decreases"];
    } else {
      return ["Best to stay indoors", "If essential, very early morning only"];
    }
  };

  if (!aqiData || !aqiData.data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-lg text-gray-600">Loading health recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  // Use aqicn.org API structure: aqiData.data.aqi
  const aqi = aqiData.data.aqi;
  const aqiLevel = getAQILevel(aqi);
  const recommendations = getHealthRecommendations(aqi);
  const bestTimes = getBestTimes(aqi);

  return (
    <div className="space-y-6">
      {/* Current Air Quality Alert */}
      <Alert className={`border-2 ${aqi >= 200 ? 'border-red-500 bg-red-50' : aqi >= 150 ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
        <AlertTriangle className={`h-4 w-4 ${aqi >= 200 ? 'text-red-500' : aqi >= 150 ? 'text-yellow-500' : 'text-green-500'}`} />
        <AlertDescription className="text-lg font-medium">
          Current air quality is <strong>{aqiLevel}</strong> (AQI: {aqi})
          {aqi >= 200 && " - Health Alert: Limit outdoor exposure"}
          {aqi >= 150 && aqi < 200 && " - Caution advised for sensitive individuals"}
          {aqi < 150 && " - Safe for outdoor activities"}
        </AlertDescription>
      </Alert>

      {/* Outdoor Activity Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Outdoor Activity Guidance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.outdoor.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${aqi <= 100 ? 'bg-green-500' : aqi <= 150 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Times for Outdoor Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span>Optimal Times for Outdoor Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {bestTimes.map((time, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-purple-800 font-medium">{time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indoor Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Indoor Environment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.indoor.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protective Measures */}
      {recommendations.protective.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <span>Protective Measures</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.protective.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vulnerable Groups */}
      {recommendations.vulnerable.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <Users className="h-5 w-5" />
              <span>Special Considerations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.vulnerable.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-red-700 font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Profile Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span>Personalize Your Health Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Get personalized recommendations based on your health conditions:</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userProfile.hasAsthma}
                  onChange={(e) => setUserProfile({...userProfile, hasAsthma: e.target.checked})}
                  className="rounded"
                />
                <span>Asthma</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userProfile.hasHeartCondition}
                  onChange={(e) => setUserProfile({...userProfile, hasHeartCondition: e.target.checked})}
                  className="rounded"
                />
                <span>Heart Condition</span>
              </label>
            </div>
            
            <div className="space-y-2">
              <select 
                value={userProfile.ageGroup}
                onChange={(e) => setUserProfile({...userProfile, ageGroup: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="child">Child (0-12)</option>
                <option value="teen">Teen (13-17)</option>
                <option value="adult">Adult (18-64)</option>
                <option value="senior">Senior (65+)</option>
              </select>
              
              <select 
                value={userProfile.activityLevel}
                onChange={(e) => setUserProfile({...userProfile, activityLevel: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="high">High Activity</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full">Save Health Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRecommendations;
