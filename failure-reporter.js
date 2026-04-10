console.log('[QA Failure Analyst] File required');
const http = require('http');
const fs = require('fs');
const path = require('path');

const FAILURES_FILE = path.join(__dirname, '.qa-failures.json');

class FailureReporter {
  constructor(options = {}) {
    console.log('[QA Failure Analyst] Reporter instantiated');
  }

 onBegin(config, suite) {
    console.log(`[QA Failure Analyst] Starting run with ${suite.allTests().length} tests`);
    try {
      fs.writeFileSync(FAILURES_FILE, JSON.stringify([]));
      console.log(`[QA Failure Analyst] Failures file created at ${FAILURES_FILE}`);
    } catch(e) {
      console.log(`[QA Failure Analyst] File write error: ${e.message}`);
    }
  }

  onTestEnd(test, result) {
    console.log(`[QA Failure Analyst] onTestEnd fired: ${test.title} - ${result.status}`);
    if (result.status !== 'failed' && result.status !== 'timedOut') return;
    console.log(`[QA Failure Analyst] Capturing failure: ${test.title}`);
    const error = result.errors[0];
    try {
      const existing = JSON.parse(fs.readFileSync(FAILURES_FILE, 'utf8'));
      existing.push({
        test_name: test.title,
        error_message: (error?.message || 'Unknown error').slice(0, 500),
        stack_trace: (error?.stack || 'No stack trace').slice(0, 1000)
      });
      fs.writeFileSync(FAILURES_FILE, JSON.stringify(existing));
      console.log(`[QA Failure Analyst] Written to file. Total failures: ${existing.length}`);
    } catch(e) {
      console.log(`[QA Failure Analyst] File write error: ${e.message}`);
    }
  }

  async onEnd(result) {
    const failures = JSON.parse(fs.readFileSync(FAILURES_FILE, 'utf8'));
    console.log(`[QA Failure Analyst] Failures captured: ${failures.length}`);
    if (failures.length === 0) return;
    console.log(`[QA Failure Analyst] Sending to API...`);
    for (const failure of failures) {
      await this.analyze(failure);
    }
    fs.unlinkSync(FAILURES_FILE);
  }

  analyze(failure) {
    return new Promise((resolve) => {
      const payload = JSON.stringify({
        test_name: failure.test_name,
        error_message: failure.error_message,
        stack_trace: failure.stack_trace,
        repo: null,
        pr_number: null
      });

      const options = {
        hostname: '127.0.0.1',
        port: 8000,
        path: '/analyze',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const diagnosis = JSON.parse(data);
            console.log('\n' + '='.repeat(60));
            console.log('QA FAILURE ANALYST DIAGNOSIS');
            console.log('='.repeat(60));
            console.log(`Test:       ${diagnosis.test_name}`);
            console.log(`Confidence: ${diagnosis.confidence?.toUpperCase()} (${diagnosis.confidence_score}%)`);
            console.log(`Root Cause: ${diagnosis.root_cause}`);
            console.log(`Fix:        ${diagnosis.fix}`);
            console.log('Patterns:');
            diagnosis.similar_patterns?.forEach(p => {
              console.log(`  - ${p.pattern} (${p.similarity})`);
            });
            console.log('='.repeat(60) + '\n');
          } catch(e) {
            console.log('[QA Failure Analyst] Parse error:', e.message);
          }
          resolve();
        });
      });

      req.on('error', (e) => {
        console.log(`[QA Failure Analyst] API not reachable: ${e.message}`);
        resolve();
      });

      req.write(payload);
      req.end();
    });
  }
}

module.exports = FailureReporter;