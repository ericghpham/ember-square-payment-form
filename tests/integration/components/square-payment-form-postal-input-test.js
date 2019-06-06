import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | square-payment-form-postal-input', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', async function(assert) {
    this.set('formId', 'abc');

    await render(hbs`{{square-payment-form-postal-input formId=formId}}`);

    const placeholderElement = document.getElementById('sq-abc-postal-input');
    assert.ok(placeholderElement, 'form ID should propagate to the postal input');
  });
});
