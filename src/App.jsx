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
    incidents: 0
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeData(prev => ({
        ...prev,
        responseTime: Math.floor(200 + Math.random() * 100), // Random between 200-300ms
        lastChecked: new Date(),
        // Occasionally simulate a small fluctuation in uptime
        uptime: 99.97 + (Math.random() * 0.03),
        status: Math.random() > 0.95 ? 'degraded' : 'operational' // 5% chance of degraded
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return '#10b981' // green
      case 'degraded': return '#f59e0b' // orange
      case 'down': return '#ef4444' // red
      default: return '#6b7280' // gray
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
      
      {/* Uptime Card - Add this component */}
      <div className="uptime-card">
        <div className="uptime-header">
          <h2>System Status</h2>
          <div className="status-badge" style={{ backgroundColor: getStatusColor(uptimeData.status) }}>
            {uptimeData.status === 'operational' ? '✅' : '⚠️'} {uptimeData.status}
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
            <span className="stat-label">Incidents (30d)</span>
            <span className="stat-value">{uptimeData.incidents}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Last Checked</span>
            <span className="stat-value">{formatTime(uptimeData.lastChecked)}</span>
          </div>
        </div>

        {/* Mini response time graph simulation */}
        <div className="response-time-graph">
          <div className="graph-bars">
            {[240, 235, 258, 245, 267, 230, 242, 255, 238, 246].map((ms, i) => (
              <div 
                key={i}
                className="graph-bar"
                style={{ 
                  height: `${ms / 3}px`,
                  backgroundColor: ms > 250 ? '#f59e0b' : '#10b981'
                }}
              />
            ))}
          </div>
          <div className="graph-label">Response time (last 10 checks)</div>
        </div>

        <div className="uptime-footer">
          <p>✅ All systems operational</p>
          <p className="update-note">Updates every 5 minutes • Last 24h: 100% uptime</p>
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