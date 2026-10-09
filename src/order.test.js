import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeBasket, updateQuantity, createOrderMessage, whatsappUrl } from './order.js';

test('saved basket rejects corrupt entries and unknown products', () => {
  assert.deepEqual(sanitizeBasket({ fish: 2, crayfish: -1, prawns: '3', pap: 100, fake: 4 }), { fish: 2 });
  assert.deepEqual(sanitizeBasket(null), {});
  assert.deepEqual(sanitizeBasket([]), {});
});
test('basket quantities stay bounded and removing last item clears it', () => {
  assert.deepEqual(updateQuantity({ fish: 1 }, 'fish', -1), {});
  assert.deepEqual(updateQuantity({ fish: 99 }, 'fish', 1), { fish: 99 });
  assert.deepEqual(updateQuantity({}, 'unknown', 1), {});
});
test('order enquiry includes selected quantities and delivery notes, without claiming an order is confirmed', () => {
  const message = createOrderMessage({ fish: 2, pap: 1 }, { name: ' Ada ', location: 'Lekki, Lagos', notes: 'Fish: 1kg please' });
  assert.match(message, /Dried fish × 2/);
  assert.match(message, /Mixed-grain pap × 1/);
  assert.match(message, /Name: Ada/);
  assert.match(message, /Delivery location: Lekki, Lagos/);
  assert.match(message, /Fish: 1kg please/);
  assert.match(message, /Please confirm availability, pack sizes, prices and delivery cost/);
  assert.ok(!message.includes('Crayfish'));
  assert.equal(createOrderMessage({}), '');
});
test('WhatsApp URL preserves special characters and line breaks', () => {
  const message = 'Hi!\nFish × 2 & pap + delivery?';
  const url = new URL(whatsappUrl(message));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/2348157542436');
  assert.equal(url.searchParams.get('text'), message);
});
