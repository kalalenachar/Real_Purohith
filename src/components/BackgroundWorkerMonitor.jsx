import React from 'react';
import { Activity, Terminal, X, CheckCircle2, Clock } from 'lucide-react';

export default function BackgroundWorkerMonitor({ tasks, onClose }) {
  const running = tasks.filter(t => t.status === 'RUNNING').length;

  return (
    <div className="worker-drawer">
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,8,16,0.95)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={18} style={{ color: '#f59e0b' }} className={running > 0 ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                Background AI Task Queue
              </h3>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 1, fontFamily: 'monospace' }}>
                {running > 0 ? `${running} worker(s) running` : 'All workers idle'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Live indicator */}
        {running > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '6px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', width: 'fit-content' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'block', animation: 'pulse-ring 1s infinite' }} />
            <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>Live execution in progress</span>
          </div>
        )}
      </div>

      {/* Task List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tasks.map(task => (
          <div key={task.id} style={{
            borderRadius: 14, overflow: 'hidden',
            border: task.status === 'RUNNING'
              ? '1px solid rgba(245,158,11,0.3)'
              : '1px solid rgba(255,255,255,0.06)',
            background: task.status === 'RUNNING'
              ? 'rgba(245,158,11,0.04)'
              : 'rgba(255,255,255,0.02)'
          }}>
            {/* Task Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginBottom: 4 }}>{task.id}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                  <Clock size={10} /> {task.createdAt}
                </div>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', flexShrink: 0,
                background: task.status === 'COMPLETED'
                  ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.15)',
                color: task.status === 'COMPLETED' ? '#34d399' : '#fbbf24',
                border: `1px solid ${task.status === 'COMPLETED' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
              }}>
                {task.status === 'COMPLETED' ? '✓ DONE' : '◉ RUNNING'}
              </span>
            </div>

            {/* Progress */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginBottom: 6 }}>
                <span>Execution Progress</span>
                <span style={{ fontWeight: 700, color: task.progress === 100 ? '#34d399' : '#fbbf24' }}>{task.progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar"
                  style={{
                    width: `${task.progress}%`,
                    background: task.progress === 100
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : 'linear-gradient(90deg, #f59e0b, #ea580c)'
                  }}
                />
              </div>
            </div>

            {/* Terminal Logs */}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Terminal size={11} style={{ color: '#64748b' }} />
                <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>stdout</span>
              </div>
              <div className="terminal-box">
                {task.logs.map((log, i) => (
                  <div key={i} className="terminal-line">
                    <span className="terminal-prompt">›</span>
                    <span className={`terminal-text ${log.toLowerCase().includes('error') ? 'warn' : log.toLowerCase().includes('completed') ? '' : 'info'}`}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
