
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AlertsSection = () => {
  const [alertSettings, setAlertSettings] = useState({
    notifications: true,
    dailySummary: true,
    emergencyAlerts: true,
    healthWarnings: false,
    aqiThreshold: 3,
    locationAlerts: true
  });

  const { toast } = useToast();

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Moderate Air Quality Alert",
      message: "AQI has reached 3 in your area. Sensitive individuals should limit outdoor activities.",
      location: "New York, NY",
      time: "2 hours ago",
      aqi: 3
    },
    {
      id: 2,
      type: "info",
      title: "Daily Air Quality Summary",
      message: "Today's average AQI was 2 (Fair). Tomorrow's forecast shows similar conditions.",
      location: "New York, NY", 
      time: "1 day ago",
      aqi: 2
    },
    {
      id: 3,
      type: "emergency",
      title: "Poor Air Quality - Health Alert",
      message: "AQI has reached 4. All individuals should avoid outdoor activities.",
      location: "Los Angeles, CA",
      time: "3 days ago",
      aqi: 4
    },
    {
      id: 4,
      type: "info",
      title: "Air Quality Improved",
      message: "Conditions have improved from Poor to Moderate. Outdoor activities can resume with caution.",
      location: "San Francisco, CA",
      time: "1 week ago",
      aqi: 3
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getAQIBadgeColor = (aqi: number) => {
    if (aqi === 1) return "bg-green-500";
    if (aqi === 2) return "bg-yellow-500";
    if (aqi === 3) return "bg-orange-500";
    if (aqi === 4) return "bg-red-500";
    if (aqi === 5) return "bg-purple-500";
    return "bg-gray-500";
  };

  const handleSettingChange = (setting: string, value: any) => {
    setAlertSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast({
      title: "Settings Updated",
      description: `Alert preferences have been saved.`,
    });
  };

  const testNotification = () => {
    toast({
      title: "Test Notification",
      description: "This is how air quality alerts will appear.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive real-time air quality alerts</p>
                </div>
                <Switch
                  checked={alertSettings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Daily Summary</h4>
                  <p className="text-sm text-gray-500">Daily air quality report</p>
                </div>
                <Switch
                  checked={alertSettings.dailySummary}
                  onCheckedChange={(checked) => handleSettingChange('dailySummary', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Emergency Alerts</h4>
                  <p className="text-sm text-gray-500">Critical air quality warnings</p>
                </div>
                <Switch
                  checked={alertSettings.emergencyAlerts}
                  onCheckedChange={(checked) => handleSettingChange('emergencyAlerts', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Health Warnings</h4>
                  <p className="text-sm text-gray-500">Personalized health recommendations</p>
                </div>
                <Switch
                  checked={alertSettings.healthWarnings}
                  onCheckedChange={(checked) => handleSettingChange('healthWarnings', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Location-based Alerts</h4>
                  <p className="text-sm text-gray-500">Alerts for saved locations</p>
                </div>
                <Switch
                  checked={alertSettings.locationAlerts}
                  onCheckedChange={(checked) => handleSettingChange('locationAlerts', checked)}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Alert Threshold</h4>
                <p className="text-sm text-gray-500">Get notified when AQI reaches:</p>
                <select 
                  value={alertSettings.aqiThreshold}
                  onChange={(e) => handleSettingChange('aqiThreshold', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value={2}>Fair (AQI 2)</option>
                  <option value={3}>Moderate (AQI 3)</option>
                  <option value={4}>Poor (AQI 4)</option>
                  <option value={5}>Very Poor (AQI 5)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={testNotification} variant="outline">
              Test Notification
            </Button>
            <Button>Save All Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Recent Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <Badge className={`${getAQIBadgeColor(alert.aqi)} text-white`}>
                          AQI {alert.aqi}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-blue-600">Total Alerts</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-sm text-yellow-600">Warnings</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-sm text-red-600">Emergency</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-green-600">Good Days</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsSection;
