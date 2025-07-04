
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Calendar, RefreshCw } from 'lucide-react';

const NewsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock news data - in a real app, this would come from a news API
  const mockNews = [
    {
      id: 1,
      title: "New Air Quality Standards Announced by EPA",
      summary: "The Environmental Protection Agency has released updated air quality standards focusing on PM2.5 and ozone levels to better protect public health.",
      category: "Environmental Policy",
      source: "EPA News",
      publishDate: "2024-01-15",
      url: "#",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Wildfire Season Brings Dangerous Air Quality to Western States",
      summary: "Multiple states are experiencing hazardous air quality levels due to ongoing wildfires, with health officials urging residents to stay indoors.",
      category: "Air Quality",
      source: "Climate News",
      publishDate: "2024-01-14",
      url: "#",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Cities Leading the Fight Against Urban Air Pollution",
      summary: "Major metropolitan areas are implementing innovative solutions to reduce air pollution, including electric vehicle incentives and green building standards.",
      category: "Pollution",
      source: "Urban Today",
      publishDate: "2024-01-13",
      url: "#",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Climate Change and Air Quality: The Hidden Connection",
      summary: "New research reveals how climate change is affecting air quality patterns globally, with implications for public health policies.",
      category: "Climate Change",
      source: "Science Today",
      publishDate: "2024-01-12",
      url: "#",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Indoor Air Quality: What You Need to Know",
      summary: "Experts share tips on improving indoor air quality, especially important during times of poor outdoor air conditions.",
      category: "Health",
      source: "Health Focus",
      publishDate: "2024-01-11",
      url: "#",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=200&fit=crop"
    },
    {
      id: 6,
      title: "Electric Vehicles Show Promise in Reducing Urban Pollution",
      summary: "A comprehensive study shows significant air quality improvements in cities with high electric vehicle adoption rates.",
      category: "Environmental Policy",
      source: "Green Tech",
      publishDate: "2024-01-10",
      url: "#",
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400&h=200&fit=crop"
    }
  ];

  const categories = [
    "all",
    "Air Quality", 
    "Climate Change",
    "Pollution",
    "Environmental Policy",
    "Health"
  ];

  const filteredNews = mockNews.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental News</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-3">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600">Loading news...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredNews.length > 0 ? (
          filteredNews.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(article.publishDate)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.source}</span>
                      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Read More
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-gray-600">No news articles found for your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
