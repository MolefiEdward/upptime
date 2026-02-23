// utils/fetchUptimeData.js
export const fetchUptimeData = async () => {
  try {
    const BASE_URL = 'https://raw.githubusercontent.com/MolefiEdward/upptime-monitor/master';
    
    // Fetch summary data
    const summaryResponse = await fetch(`${BASE_URL}/api/summary.json`);
    const summaryData = await summaryResponse.json();
    
    // Get the first site (your app)
    const siteData = summaryData[0] || {};
    
    // Try to fetch response time history for charts
    let historyData = [];
    try {
      const historyResponse = await fetch(`${BASE_URL}/api/my-app/response-time.json`);
      historyData = await historyResponse.json();
    } catch (e) {
      console.log('No response time history yet');
    }
    
    return {
      // Current metrics
      uptime: parseFloat(siteData.uptime) || 99.9,
      uptimeDay: siteData.uptimeDay || '100.00%',
      uptimeWeek: siteData.uptimeWeek || '100.00%',
      uptimeMonth: siteData.uptimeMonth || '100.00%',
      uptimeYear: siteData.uptimeYear || '100.00%',
      responseTime: siteData.time || 0,
      status: siteData.status || 'up',
      siteName: siteData.name || 'My App',
      
      // Historical data for charts
      history: historyData,
      
      // Raw data
      raw: siteData
    };
    
  } catch (error) {
    console.error('Error fetching uptime data:', error);
    return {
      uptime: 99.9,
      uptimeDay: '100.00%',
      uptimeWeek: '100.00%',
      uptimeMonth: '100.00%',
      responseTime: 0,
      status: 'unknown',
      history: []
    };
  }
};

// Fetch specific site data by slug
export const fetchSiteData = async (slug = 'my-app') => {
  try {
    const BASE_URL = 'https://raw.githubusercontent.com/MolefiEdward/upptime-monitor/master';
    
    const [uptime, responseTime] = await Promise.all([
      fetch(`${BASE_URL}/api/${slug}/uptime.json`).then(res => res.json()),
      fetch(`${BASE_URL}/api/${slug}/response-time.json`).then(res => res.json())
    ]);
    
    return {
      uptime: uptime,
      responseTime: responseTime
    };
  } catch (error) {
    console.error('Error fetching site data:', error);
    return null;
  }
};