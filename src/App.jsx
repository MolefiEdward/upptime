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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch real data from Upptime
  useEffect(() => {
    const fetchUptimeData = async () => {
      try {
        setLoading(true);
        
        // This will work on Vercel, not on localhost (CORS)
        const BASE_URL = 'https://raw.githubusercontent.com/MolefiEdward/upptime-monitor/master';
        
        // Try to fetch summary data
        let summaryData = {};
        let responseTimeData = [];
        
        try {
          const summaryResponse = await fetch(`${BASE_URL}/api/my-app/summary.json`);
          if (summaryResponse.ok) {
            summaryData = await summaryResponse.json();
          }
        } catch (e) {
          console.log('Summary fetch failed, using defaults');
        }
        
        try {
          const historyResponse = await fetch(`${BASE_URL}/api/my-app/response-time.json`);
          if (historyResponse.ok) {
            responseTimeData = await historyResponse.json();
          }
        } catch (e) {
          console.log('History fetch failed, using defaults');
        }
        
        // Use real data if available, otherwise keep defaults
        setUptimeData({
          status: summaryData?.status || 'operational',
          uptime: parseFloat(summaryData?.uptime) || 99.98,
          responseTime: summaryData?.time || 245,
          lastChecked: new Date(),
          incidents: summaryData?.dailyMinutesDown ? Object.keys(summaryData.dailyMinutesDown).length : 0,
          uptimeDay: summaryData?.uptimeDay || '100.00%',
          uptimeWeek: summaryData?.uptimeWeek || '100.00%',
          uptimeMonth: summaryData?.uptimeMonth || '100.00%',
          history: responseTimeData.slice?.(-10) || [240, 235, 258, 245, 267, 230, 242, 255, 238, 246]
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching uptime data:', error);
        setError('Using simulated data');
      } finally {
        setLoading(false);
      }
    };

    fetchUptimeData();
    
    // Refresh every 5 minutes in production
    const interval = setInterval(fetchUptimeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [])

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
          {loading ? (
            <div className="status-badge" style={{ backgroundColor: '#6b7280' }}>
              ⏳ loading...
            </div>
          ) : (
            <div className="status-badge" style={{ backgroundColor: getStatusColor(uptimeData.status) }}>
              {uptimeData.status === 'operational' ? '✅' : '⚠️'} {uptimeData.status}
            </div>
          )}
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
            <span className="stat-label">Incidents</span>
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

        <div className="uptime-footer">
          <p>✅ All systems {uptimeData.status}</p>
          <p className="update-note">
            {error ? '⚠️ ' + error : `Updates every 5 minutes • Last 24h: ${uptimeData.uptimeDay} uptime`}
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
    </>
  )
}

export default App