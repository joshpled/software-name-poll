const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function poll(fetchResult = { ok: true }, configured = true) {
  const elements = {};
  const requests = [];
  function element() {
    return { value: '', textContent: '', style: {}, children: [], disabled: false,
      classList: { add() {} }, appendChild(child) { this.children.push(child); },
      addEventListener(_, handler) { this.submit = handler; } };
  }
  const source = script
    .replace(/const SUPABASE_URL = "[^"]*";/, `const SUPABASE_URL = "${configured ? 'https://test.supabase.co' : 'PASTE_YOUR_SUPABASE_URL'}";`)
    .replace(/const SUPABASE_PUBLISHABLE_KEY = "[^"]*";/, `const SUPABASE_PUBLISHABLE_KEY = "${configured ? 'sb_publishable_test' : 'PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY'}";`);
  vm.runInNewContext(source, {
    document: {
      getElementById: id => elements[id] ??= element(),
      createElement: element
    },
    fetch: async (...args) => { requests.push(args); return fetchResult; },
    console: { error() {} }
  });
  return { elements, requests, submit: () => elements.pollForm.submit({ preventDefault() {} }) };
}
function rank(p) {
  ['first', 'second', 'third'].forEach((id, i) => {
    p.elements[id].value = ['Protean', 'Manifold', 'Morphic'][i];
  });
}

test('shows all eight names and selection placeholders', () => {
  const p = poll();
  assert.equal(p.elements.nameList.children.length, 8);
  assert.equal(p.elements.first.children.length, 9);
});
test('missing, duplicate and contradictory ranks never reach the API', async () => {
  const p = poll();
  await p.submit();
  assert.match(p.elements.message.textContent, /Please rank/);
  rank(p);
  p.elements.second.value = 'Protean';
  await p.submit();
  assert.match(p.elements.message.textContent, /must be different/);
  rank(p);
  p.elements.reject.value = 'Protean';
  await p.submit();
  assert.match(p.elements.message.textContent, /can't also/);
  assert.equal(p.requests.length, 0);
});
test('valid vote uses publishable apikey, minimal response and no bearer key', async () => {
  const p = poll();
  rank(p);
  await p.submit();
  const [url, request] = p.requests[0];
  assert.equal(url, 'https://test.supabase.co/rest/v1/name_poll_votes');
  assert.equal(request.method, 'POST');
  assert.equal(request.headers.apikey, 'sb_publishable_test');
  assert.equal(request.headers.Authorization, undefined);
  assert.equal(request.headers.Prefer, 'return=minimal');
  assert.deepEqual(JSON.parse(request.body), {
    first_choice: 'Protean', second_choice: 'Manifold', third_choice: 'Morphic',
    reject_choice: null, comment: null
  });
  assert.equal(p.elements.thanks.style.display, 'block');
});
test('API rejection shows an error and permits retry', async () => {
  const p = poll({ ok: false, status: 403 });
  rank(p);
  await p.submit();
  assert.match(p.elements.message.textContent, /Something went wrong/);
  assert.equal(p.elements.submitBtn.disabled, false);
  assert.notEqual(p.elements.thanks?.style.display, 'block');
});
test('unconfigured page blocks submission with owner guidance', async () => {
  const p = poll(undefined, false);
  rank(p);
  await p.submit();
  assert.match(p.elements.message.textContent, /connect Supabase/);
  assert.equal(p.requests.length, 0);
});
