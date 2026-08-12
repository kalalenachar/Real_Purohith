/**
 * Asynchronous Background Task Queue & Worker Manager
 * Simulates background AI jobs, push notification dispatchers, and worker threads.
 */

import { processUserFeedback } from './aiFeedbackProcessor.js';
import { calculateNextTithiAllotments } from './aiTimeAllotmentEngine.js';

class BackgroundQueueManager {
  constructor() {
    this.tasks = [
      {
        id: 'TASK-101',
        type: 'TIME_ALLOTMENT_CALCULATION',
        name: 'Solar-Lunar Tithi Pre-Allotment Engine',
        status: 'COMPLETED',
        progress: 100,
        createdAt: new Date(Date.now() - 3600000).toLocaleTimeString(),
        logs: [
          'Worker #1 initialized for Tithi calculation.',
          'Fetched 3 devotee family vaults.',
          'Converted Hindu Lunar calendar (Bhadrapada Krishna Navami) to Gregorian date.',
          'Matched Uttaradhi Mutt & Sri Vaishnava Vadagalai lineages successfully.',
          'FCM & APNs push notification payloads formatted.'
        ]
      },
      {
        id: 'TASK-102',
        type: 'FEEDBACK_PROCESSING',
        name: 'AI Sampradaya Feedback & Sentiment Processor',
        status: 'COMPLETED',
        progress: 100,
        createdAt: new Date(Date.now() - 1800000).toLocaleTimeString(),
        logs: [
          'Worker #2 processing review FB-501.',
          'Extracted 5-star parameter scores.',
          'Analyzed text: "flawless Nyaya Sudha paddhati". Sentiment score: 0.99',
          'Updated Vidwan Raghavendra Acharya Trust Score: +2 (Current: 98)'
        ]
      }
    ];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener([...this.tasks]));
  }

  getTasks() {
    return [...this.tasks];
  }

  enqueueTask(type, payload, onCompleteCallback) {
    const taskId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    const newTask = {
      id: taskId,
      type,
      name: this.getTaskName(type),
      status: 'RUNNING',
      progress: 15,
      createdAt: new Date().toLocaleTimeString(),
      logs: [`Worker picked up ${taskId}`, `Type: ${type}`, `Payload initialized...`]
    };

    this.tasks.unshift(newTask);
    this.notify();

    // Simulate async steps
    setTimeout(() => {
      newTask.progress = 55;
      newTask.logs.push('Executing AI NLP & Sampradaya matching routines...');
      this.notify();

      setTimeout(() => {
        let result = null;
        if (type === 'FEEDBACK_PROCESSING') {
          result = processUserFeedback(payload);
          newTask.logs.push(`AI Analysis complete. Sentiment: ${result.sentiment}`);
          newTask.logs.push(`Outbound call required: ${result.triggerOutboundCall ? 'YES' : 'NO'}`);
        } else if (type === 'TIME_ALLOTMENT_CALCULATION') {
          result = calculateNextTithiAllotments(payload);
          newTask.logs.push(`Calculated ${result.totalAllotments} upcoming Tithi allotments.`);
        } else if (type === 'SOS_APARA_DISPATCH') {
          newTask.logs.push(`Broadcasting SOS alert to 5 nearby verified Apara Acharyas.`);
          newTask.logs.push(`Guaranteed 30-Minute SLA Timer Started.`);
        }

        newTask.progress = 100;
        newTask.status = 'COMPLETED';
        newTask.logs.push(`Task ${taskId} completed successfully.`);
        this.notify();

        if (onCompleteCallback) {
          onCompleteCallback(result);
        }
      }, 1200);
    }, 800);
  }

  getTaskName(type) {
    switch (type) {
      case 'FEEDBACK_PROCESSING': return 'AI Sampradaya Feedback Sentiment Task';
      case 'TIME_ALLOTMENT_CALCULATION': return 'Solar-Lunar Tithi Pre-Allotment Task';
      case 'SOS_APARA_DISPATCH': return '30-Min SLA Emergency SOS Apara Dispatch';
      default: return 'Background Processing Job';
    }
  }
}

export const backgroundQueue = new BackgroundQueueManager();
