import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Wheat, MessageCircle, User as UserIcon, Volume2, Mic, Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useCrops } from "@/hooks/useCrops";
import { useAuth } from "@/hooks/useAuth";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface IndexProps {
  user: User | null;
  onShowAuth: () => void;
}

const Index = ({ user, onShowAuth }: IndexProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const { weather } = useWeather();
  const { crops } = useCrops();
  const { signOut } = useAuth();
  const { speak } = useTextToSpeech();

  const speakWelcome = () => {
    const text = user 
      ? `Welcome back to Smart Crop Advisor! You can check weather, browse crops, or ask our farming assistant.`
      : `Welcome to Smart Crop Advisor! Please sign in to access all features including weather forecast and personalized crop advice.`;
    speak(text);
  };

  const getWeatherIcon = (condition: string | null) => {
    if (!condition) return <Sun className="h-8 w-8" />;
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return <CloudRain className="h-8 w-8" />;
    if (cond.includes('cloud')) return <Cloud className="h-8 w-8" />;
    return <Sun className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crop to-background">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-crop/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-8 w-8 text-crop" />
            <h1 className="text-2xl font-bold text-crop">Smart Crop Advisor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={speakWelcome}>
              <Volume2 className="h-4 w-4" />
            </Button>
            {user ? (
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={onShowAuth}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-crop/10 to-soil/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-6 w-6" />
                  {user ? `Welcome back, ${user.email}!` : 'Welcome to Smart Crop Advisor'}
                </CardTitle>
                <CardDescription>
                  Voice-first farming guidance for better crops
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Today's Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weather.length > 0 ? (
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weather[0]?.weather_condition)}
                    <div>
                      <p className="text-2xl font-bold">{weather[0]?.temperature}°C</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {weather[0]?.weather_condition}
                      </p>
                    </div>
                    <div className="ml-auto space-y-1">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4" />
                        <span className="text-sm">{weather[0]?.wind_speed} km/h</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Humidity: {weather[0]?.humidity}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Sun className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">25°C</p>
                      <p className="text-sm text-muted-foreground">Sunny</p>
                    </div>
                    <div className="ml-auto space-y-1">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4" />
                        <span className="text-sm">12 km/h</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Humidity: 65%
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('crops')}>
                <CardContent className="p-6 text-center">
                  <Wheat className="h-12 w-12 mx-auto mb-4 text-crop" />
                  <h3 className="font-semibold">Browse Crops</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Discover the best crops for your soil and season
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('chat')}>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-water" />
                  <h3 className="font-semibold">Ask Assistant</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get personalized farming advice
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('profile')}>
                <CardContent className="p-6 text-center">
                  <UserIcon className="h-12 w-12 mx-auto mb-4 text-soil" />
                  <h3 className="font-semibold">Profile</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Manage your farming preferences
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Crops */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Crops This Season</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crops.length > 0 ? (
                    crops.slice(0, 3).map((crop) => (
                      <Card key={crop.id} className="border border-crop/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-crop">{crop.crop_name}</h4>
                          <div className="flex gap-2 mt-2">
                            {crop.soil_type && (
                              <Badge variant="secondary" className="bg-soil/20 text-soil">
                                {crop.soil_type}
                              </Badge>
                            )}
                            {crop.season && (
                              <Badge variant="secondary" className="bg-crop/20 text-crop">
                                {crop.season}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {crop.fertilizer_tip}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    // Sample data when no crops loaded
                    [
                      { id: '1', crop_name: 'Wheat', soil_type: 'loamy', season: 'winter', fertilizer_tip: 'Apply nitrogen fertilizer during tillering stage' },
                      { id: '2', crop_name: 'Rice', soil_type: 'clay', season: 'monsoon', fertilizer_tip: 'Use urea fertilizer in split doses' },
                      { id: '3', crop_name: 'Cotton', soil_type: 'black', season: 'summer', fertilizer_tip: 'Apply balanced NPK fertilizer' }
                    ].map((crop) => (
                      <Card key={crop.id} className="border border-crop/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-crop">{crop.crop_name}</h4>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="bg-soil/20 text-soil">
                              {crop.soil_type}
                            </Badge>
                            <Badge variant="secondary" className="bg-crop/20 text-crop">
                              {crop.season}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {crop.fertilizer_tip}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-crop">Crop Advisory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(crops.length > 0 ? crops : [
                { id: '1', crop_name: 'Wheat', crop_name_hindi: 'गेहूं', soil_type: 'loamy', season: 'winter', fertilizer_tip: 'Apply nitrogen fertilizer during tillering stage' },
                { id: '2', crop_name: 'Rice', crop_name_hindi: 'चावल', soil_type: 'clay', season: 'monsoon', fertilizer_tip: 'Use urea fertilizer in split doses' },
                { id: '3', crop_name: 'Cotton', crop_name_hindi: 'कपास', soil_type: 'black', season: 'summer', fertilizer_tip: 'Apply balanced NPK fertilizer' },
                { id: '4', crop_name: 'Sugarcane', crop_name_hindi: 'गन्ना', soil_type: 'loamy', season: 'year-round', fertilizer_tip: 'Heavy nitrogen requirement, apply in stages' },
                { id: '5', crop_name: 'Maize', crop_name_hindi: 'मक्का', soil_type: 'sandy-loam', season: 'summer', fertilizer_tip: 'Side dress with nitrogen at knee-high stage' }
              ]).map((crop) => (
                <Card key={crop.id} className="border border-crop/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-crop mb-2">{crop.crop_name}</h3>
                    <div className="flex gap-2 mb-4">
                      {crop.soil_type && (
                        <Badge variant="secondary" className="bg-soil/20 text-soil">
                          🪨 {crop.soil_type}
                        </Badge>
                      )}
                      {crop.season && (
                        <Badge variant="secondary" className="bg-crop/20 text-crop">
                          📅 {crop.season}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{crop.fertilizer_tip}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => speak(crop.fertilizer_tip || '')}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen to Tips
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-water">Farming Assistant</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-water" />
                <h3 className="text-xl font-semibold mb-2">Voice-Powered Assistant</h3>
                <p className="text-muted-foreground mb-6">
                  Ask questions about farming, crops, weather, and get instant advice
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🌱</span>
                      <p className="font-medium">Best crops for this season</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🐛</span>
                      <p className="font-medium">Pest control advice</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">💧</span>
                      <p className="font-medium">Fertilizer tips</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🌧️</span>
                      <p className="font-medium">Weather forecast</p>
                    </div>
                  </Button>
                </div>
                <Button size="lg" className="mt-6 bg-water hover:bg-water/90">
                  <Mic className="h-5 w-5 mr-2" />
                  Start Voice Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-soil">Profile & Settings</h2>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>👤 Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Email:</strong> {user.email}</p>
                    <Button variant="outline" className="mt-4">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Update with Voice
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>🌐 Language Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">English</Button>
                      <Button variant="outline" className="w-full justify-start">हिंदी (Hindi)</Button>
                      <Button variant="outline" className="w-full justify-start">ਪੰਜਾਬੀ (Punjabi)</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>📍 Location Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Mic className="h-4 w-4 mr-2" />
                      Update Location
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>🔔 Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">Weather Alerts: ON</Button>
                      <Button variant="outline" className="w-full justify-start">Crop Tips: ON</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <UserIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Sign in to access profile</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account to save your preferences and get personalized advice
                  </p>
                  <Button onClick={onShowAuth}>Sign In / Sign Up</Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-crop/20 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex-col h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant={activeTab === 'crops' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('crops')}
            className="flex-col h-auto py-2"
          >
            <Wheat className="h-5 w-5" />
            <span className="text-xs mt-1">Crops</span>
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="flex-col h-auto py-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Chat</span>
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="flex-col h-auto py-2"
          >
            <UserIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </nav>

      {/* Bottom padding for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Index;
