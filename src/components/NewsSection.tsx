
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Calendar, RefreshCw } from 'lucide-react';

const NewsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);

  const NEWS_API_KEY = "7616dbfd53964d7e9a10488392e36a36";

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const url = `https://newsapi.org/v2/everything?q=environment+OR+climate&from=${today}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      
      console.log("News API Response:", data);
      
      if (data.status === "ok" && data.articles) {
        const validArticles = data.articles.filter(article => 
          article.title && 
          article.title !== "[Removed]" && 
          article.description && 
          article.description !== "[Removed]" &&
          article.url
        );
        
        const transformedNews = validArticles.slice(0, 15).map((article, index) => ({
          id: index + 1,
          title: article.title,
          summary: article.description || (article.content ? article.content.substring(0, 200) + "..." : "Read more about this environmental story."),
          category: determineCategory(article.title + " " + (article.description || "")),
          source: article.source?.name || "News Source",
          publishDate: article.publishedAt,
          url: article.url,
          image: article.urlToImage || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=200&fit=crop"
        }));
        setNews(transformedNews);
      } else {
        console.error("No valid articles found");
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const determineCategory = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('climate') || lowerText.includes('warming')) return 'Climate Change';
    if (lowerText.includes('pollution') || lowerText.includes('air quality')) return 'Air Quality';
    if (lowerText.includes('policy') || lowerText.includes('government')) return 'Environmental Policy';
    if (lowerText.includes('health') || lowerText.includes('medical')) return 'Health';
    return 'Environmental';
  };

  // Mock news data - fallback (removed as per user request)
  const mockNews = [];

  const categories = [
    "all",
    "Air Quality", 
    "Climate Change",
    "Pollution",
    "Environmental Policy",
    "Health"
  ];

  const filteredNews = news.filter(article => {
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
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Read More
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
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
