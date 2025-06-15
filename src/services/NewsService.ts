interface NewsItem {
  title: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  time: string;
  source: string;
  marketMove?: string;
  historicalPattern?: string;
  category: string;
  relevance: number;
}

class NewsService {
  private newsCache: { [key: string]: NewsItem[] } = {};
  private lastFetch: Date = new Date(0);
  private fetchInterval = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.startNewsUpdates();
  }

  private startNewsUpdates() {
    // Update news every hour between 8 AM and 4 PM
    setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 8 && hour <= 16) {
        this.fetchLatestNews();
      }
    }, this.fetchInterval);

    // Initial fetch
    this.fetchLatestNews();
  }

  private async fetchLatestNews() {
    try {
      // Simulate fetching from multiple sources
      const sources = [
        'Times Now India',
        'Economic Times',
        'Google News',
        'Reuters India',
        'Bloomberg India'
      ];

      const mockNews: NewsItem[] = [
        {
          title: 'RBI Monetary Policy: Repo Rate Held at 6.50%',
          summary: 'Reserve Bank maintains accommodative stance, inflation concerns persist',
          impact: 'High',
          sentiment: 'Neutral',
          time: this.getTimeAgo(2),
          source: 'Economic Times',
          marketMove: '+0.85%',
          historicalPattern: 'Similar to Dec 2022 decision - market rallied 1.2% next day',
          category: 'Monetary Policy',
          relevance: 95
        },
        {
          title: 'Q3 GDP Growth Accelerates to 6.8%',
          summary: 'Manufacturing and services sectors show strong momentum',
          impact: 'High',
          sentiment: 'Positive',
          time: this.getTimeAgo(4),
          source: 'Times Now India',
          marketMove: '+1.20%',
          historicalPattern: 'GDP beats often trigger 0.8-1.5% index gains',
          category: 'Economic Data',
          relevance: 92
        },
        {
          title: 'Banking Sector NPAs Decline to 3.2%',
          summary: 'Major banks report improved asset quality in Q3',
          impact: 'High',
          sentiment: 'Positive',
          time: this.getTimeAgo(1),
          source: 'Reuters India',
          marketMove: '+1.45%',
          historicalPattern: 'NPA improvements historically boost banking index by 1-2%',
          category: 'Banking',
          relevance: 98
        },
        {
          title: 'FII Inflows Touch ₹15,000 Crore This Week',
          summary: 'Foreign institutional investors show renewed interest in Indian markets',
          impact: 'Medium',
          sentiment: 'Positive',
          time: this.getTimeAgo(3),
          source: 'Bloomberg India',
          marketMove: '+0.65%',
          historicalPattern: 'Strong FII inflows typically support market for 3-5 days',
          category: 'Market Flow',
          relevance: 87
        },
        {
          title: 'Oil Prices Surge 3% on Middle East Tensions',
          summary: 'Crude oil prices spike affecting energy and transportation sectors',
          impact: 'Medium',
          sentiment: 'Negative',
          time: this.getTimeAgo(5),
          source: 'Google News',
          marketMove: '-0.45%',
          historicalPattern: 'Oil spikes above $85 historically create market volatility',
          category: 'Commodities',
          relevance: 78
        }
      ];

      // Cache news by index
      this.newsCache['NIFTY50'] = mockNews.filter(news => 
        ['Monetary Policy', 'Economic Data', 'Market Flow', 'Commodities'].includes(news.category)
      );
      
      this.newsCache['BANKNIFTY'] = mockNews.filter(news => 
        ['Banking', 'Monetary Policy', 'Market Flow'].includes(news.category)
      );

      this.lastFetch = new Date();
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  private getTimeAgo(hours: number): string {
    if (hours < 1) {
      return `${Math.floor(hours * 60)} minutes ago`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  getNewsForIndex(indexName: string): NewsItem[] {
    return this.newsCache[indexName] || this.newsCache['NIFTY50'] || [];
  }

  getLastUpdateTime(): Date {
    return this.lastFetch;
  }

  isNewsStale(): boolean {
    return Date.now() - this.lastFetch.getTime() > this.fetchInterval;
  }
}

export const newsService = new NewsService();