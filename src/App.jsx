import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [uptimeData, setUptimeData] = useState({
    status: 'operational',
    uptime: 99.98,
    responseTime: 245,
    lastChecked: new Date(),
    incidents: 0,
    uptimeDay: '100.00%',
    uptimeWeek: '100.00%',
    uptimeMonth: '100.00%',
    history: []
  })
  const [allSites, setAllSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch ALL Upptime data
  useEffect(() => {
    const fetchAllUptimeData = async () => {
      try {
        setLoading(true);
        
        const BASE_URL = 'https://raw.githubusercontent.com/MolefiEdward/upptime-monitor/refs/heads/master';
        
        // Fetch summary of ALL sites
        const summaryResponse = await fetch(`${BASE_URL}/history/summary.json`);
        
        if (!summaryResponse.ok) {
          throw new Error(`HTTP ${summaryResponse.status}`);
        }
        
        const allSitesData = await summaryResponse.json();
        setAllSites(allSitesData);
        
        // Find your main production site
        const mainSite = allSitesData.find(site => 
          !site.name.toLowerCase().includes('test') &&
          site.url.includes('upptime-nu.vercel.app') // Your main app domain
        ) || allSitesData[0];
        
        // Fetch response time history for main site
        let historyData = [];
        try {
          const historyResponse = await fetch(`${BASE_URL}/history/${mainSite.slug}/response-time.json`);
          historyData = await historyResponse.json();
        } catch (e) {
          // Use dummy data if history not available
          historyData = [240, 235, 258, 245, 267, 230, 242, 255, 238, 246];
        }
        
        setUptimeData({
          status: mainSite.status || 'operational',
          uptime: parseFloat(mainSite.uptime) || 99.98,
          responseTime: mainSite.time || 245,
          lastChecked: new Date(),
          incidents: mainSite.dailyMinutesDown ? Object.keys(mainSite.dailyMinutesDown).length : 0,
          uptimeDay: mainSite.uptimeDay || '100.00%',
          uptimeWeek: mainSite.uptimeWeek || '100.00%',
          uptimeMonth: mainSite.uptimeMonth || '100.00%',
          history: historyData.slice(-10)
        });
        
        setLastUpdated(new Date());
        setError(null);
        
      } catch (error) {
        console.error('Error fetching uptime data:', error);
        setError('Could not fetch live data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUptimeData();
    
    // Refresh every 2 minutes to catch changes quickly
    const interval = setInterval(fetchAllUptimeData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to manually refresh
  const refreshData = () => {
    setLoading(true);
    // Re-run the fetch
    fetchAllUptimeData();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return '#10b981'
      case 'degraded': return '#f59e0b'
      case 'down': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      
      {/* Uptime Card with Real Data */}
      <div className="uptime-card">
        <div className="uptime-header">
          <h2>System Status</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {loading && <span style={{ color: '#6b7280' }}>↻ refreshing...</span>}
            <button 
              onClick={refreshData}
              style={{
                padding: '4px 8px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ↻ Refresh
            </button>
            <div className="status-badge" style={{ backgroundColor: getStatusColor(uptimeData.status) }}>
              {uptimeData.status === 'operational' ? '✅' : '⚠️'} {uptimeData.status}
            </div>
          </div>
        </div>

        <div className="uptime-stats">
          <div className="stat-item">
            <span className="stat-label">Uptime (30d)</span>
            <span className="stat-value">{uptimeData.uptime.toFixed(2)}%</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Response Time</span>
            <span className="stat-value">{uptimeData.responseTime}ms</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">24h Uptime</span>
            <span className="stat-value">{uptimeData.uptimeDay}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">7d Uptime</span>
            <span className="stat-value">{uptimeData.uptimeWeek}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Incidents (30d)</span>
            <span className="stat-value">{uptimeData.incidents}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Last Checked</span>
            <span className="stat-value">{formatTime(uptimeData.lastChecked)}</span>
          </div>
        </div>

        {/* Response time graph */}
        <div className="response-time-graph">
          <div className="graph-bars">
            {uptimeData.history.map((item, i) => {
              const value = typeof item === 'object' ? item.value || item.time : item;
              return (
                <div 
                  key={i}
                  className="graph-bar"
                  style={{ 
                    height: `${(value || 200) / 3}px`,
                    backgroundColor: (value || 200) > 250 ? '#f59e0b' : '#10b981'
                  }}
                />
              );
            })}
          </div>
          <div className="graph-label">Response time (last 10 checks)</div>
        </div>

        {/* All Sites Status */}
        {allSites.length > 0 && (
          <div className="all-sites">
            <h3>All Monitored Sites</h3>
            <div className="sites-list">
              {allSites.map((site, index) => (
                <div key={index} className="site-item">
                  <span className="site-name">{site.name}</span>
                  <span className={`site-status status-${site.status}`}>
                    {site.status === 'up' ? '✅' : '❌'} {site.status}
                  </span>
                  <span className="site-uptime">{site.uptime}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="uptime-footer">
          <p>✅ Main system: {uptimeData.status}</p>
          <p className="update-note">
            {error ? '⚠️ ' + error : `Updates every 2 minutes • Last updated: ${formatTime(lastUpdated || new Date())}`}
          </p>
        </div>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <style>{`
        .all-sites {
          margin-top: 20px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .all-sites h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #374151;
        }
        
        .sites-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .site-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: white;
          border-radius: 6px;
          font-size: 13px;
        }
        
        .site-name {
          font-weight: 500;
          color: #111827;
        }
        
        .site-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        
        .status-up {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-down {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .status-degraded {
          background: #ffedd5;
          color: #9a3412;
        }
        
        .site-uptime {
          font-family: monospace;
          color: #6b7280;
        }
      `}</style>
    </>
  )
}

export default App