import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { trim } from 'dummy/tests/helpers/test-helpers';

module('Integration | Component | square-payment-form-credit-card-fields', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{square-payment-form-credit-card-fields}}`);

    assert.equal(trim(this.element.textContent), '');

    // Template block usage:
    await render(hbs`
      {{#square-payment-form-credit-card-fields}}
        template block text
      {{/square-payment-form-credit-card-fields}}
    `);

    assert.equal(trim(this.element.textContent), 'template block text');
  });
});