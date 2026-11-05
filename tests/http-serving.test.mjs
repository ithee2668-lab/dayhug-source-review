import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createServer} from 'node:net';
import {cp, mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));

async function unusedLoopbackPort() {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const {port} = reservation.address();
  await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
  return port;
}

test('documented npm start target serves the complete local prototype', {timeout: 20000}, async t => {
  const sandbox = await mkdtemp(join(tmpdir(), 'harupoom-http-'));
  let child;
  let exited;
  t.after(async () => {
    if (child && child.exitCode === null && child.signalCode === null) child.kill('SIGINT');
    if (exited) await exited;
    await rm(sandbox, {recursive: true, force: true});
  });
  for (const name of ['package.json', 'server', 'dist']) {
    await cp(join(root, name), join(sandbox, name), {recursive: true});
  }
  const pkg = JSON.parse(await readFile(join(sandbox, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.start, 'node server/index.mjs', 'exercise the exact documented npm start target');
  const port = await unusedLoopbackPort();
  const base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: sandbox,
    env: {...process.env, HARUPOOM_PORT: String(port)},
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  exited = once(child, 'exit');
  let ready = false;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (child.exitCode !== null || child.signalCode !== null) assert.fail(`local server exited: ${output}`);
    try {
      const response = await fetch(base, {signal: AbortSignal.timeout(500)});
      ready = response.status === 200;
      await response.arrayBuffer();
      if (ready) break;
    } catch {}
    await delay(30);
  }
  assert.ok(ready, `local server did not become ready: ${output}`);

  await t.test('root HTML and stylesheet return their exact packaged bytes', async () => {
    for (const [path, file, type] of [['/', 'index.html', 'text/html'], ['/style.css', 'style.css', 'text/css']]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.ok(response.headers.get('content-type').startsWith(type), path);
      assert.equal(await response.text(), await readFile(join(sandbox, 'dist', file), 'utf8'), path);
    }
  });

  await t.test('app and every relative JavaScript import are reachable', async () => {
    const pending = ['/app.mjs'];
    const seen = new Set();
    while (pending.length) {
      const path = pending.shift();
      if (seen.has(path)) continue;
      seen.add(path);
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.ok(response.headers.get('content-type').startsWith('text/javascript'), path);
      const source = await response.text();
      assert.equal(source, await readFile(join(sandbox, 'dist', path.slice(1)), 'utf8'), path);
      for (const match of source.matchAll(/\bfrom\s*['"](\.\.?\/[^'"]+)['"]/g)) {
        const dependency = new URL(match[1], base + path);
        assert.equal(dependency.origin, base);
        pending.push(dependency.pathname);
      }
    }
    assert.ok(seen.has('/core.mjs'));
    assert.ok(seen.has('/meal-core.mjs'));
  });

  await t.test('standalone HTML download returns exact offline package', async () => {
    const response = await fetch(base + '/harupoom-offline.html');
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith('text/html'));
    assert.equal(await response.text(), await readFile(join(sandbox, 'dist/harupoom-offline.html'), 'utf8'));
  });

  await t.test('source, runtime databases and unknown paths remain unavailable', async () => {
    for (const path of ['/server/index.mjs', '/package.json', '/.local/harupoom.sqlite', '/missing.mjs']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 404, path);
      await response.arrayBuffer();
    }
  });
});
