import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box-light.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';

/**
 * `multi-select-combo-box`
 * Multi select combo box based on vaadin-combo-box component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MultiSelectComboBox extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        width: 400px;
      }

      vaadin-combo-box-light {
        display: block;
        width: 100%;
      }

      vaadin-text-field {
        width: 100%;
      }

      #tokens {
        display: flex;
        max-width: 100%;
        overflow: hidden;
      }

      .token {
        font-size: .875rem;
        display: flex;
        padding: 0.25rem;
        border-radius: 0.125em;
        background-color: hsla(214, 53%, 23%, 0.16);
        margin-right: 0.25rem;
        cursor: pointer;
        white-space: nowrap;
      }

      iron-icon {
        --iron-icon-width: .875rem;
        --iron-icon-height: .875rem;
      }
    </style>

    <vaadin-combo-box-light id="cb" items="[[items]]" value="{{_cbValue}}" item-value-path="[[valueField]]" item-label-path="[[displayField]]">
      <template>[[_getItemDisplayText(item)]]</template>
      <vaadin-text-field on-keydown="_onKeyDown" label="[[label]]" id="tf" on-change="__checkValue" on-blur="__checkValue">
        <div slot="prefix" id="tokens">
          <template is="dom-repeat" items="[[value]]">
            <div class="token" on-click="_onTokenClick">[[_getItemDisplayText(item)]]
              <iron-icon icon="icons:close"></iron-icon>
            </div>
          </template>
        </div>
      </vaadin-text-field>
    </vaadin-combo-box-light>
`;
  }

  static get is() { return 'multi-select-combo-box'; }
  static get properties() {
    return {
      items: {
        type: Array,
        value: () => []
      },
      value: {
        type: Array,
        value: () => [],
        notify: true
      },
      label: String,
      _cbValue: Object,
      displayField: {
        type: String
      },
      valueField: {
        type: String
      }
    }
  }

  static get observers() {
    return [
      '_cbValueChanged(_cbValue)',
      '__checkValue(value.length)'
    ]
  }

  __checkValue(){
    this.$.tf.hasValue = this.value.length > 0;
  }

  removeItem(item) {
    this.splice('value', this.value.indexOf(item), 1);
    this.$.tf.hasValue = this.value.length > 0;
    this.push('items', item);
  }

  addItem(item) {
    this.push('value', item);
    this.$.tf.hasValue = this.value.length > 0;
    this.splice('items', this.items.indexOf(item), 1);
  }

  _cbValueChanged(cbValue) {
    if (cbValue) {
      const selectedItem = this.items.find(item => {
        if (this.valueField != null && this.valueField !== '') {
          if (item[this.valueField] != null) {
            return item[this.valueField] == cbValue;
          }
        }
        return item == cbValue;
      });

      this.addItem(selectedItem);
    }

    this._cbValue = '';

    requestAnimationFrame(() => {
      // added to make sure clicks dont cause this
      this.$.tf.clear();
    });

    // TODO: This shouldn't be needed!
    setTimeout(() => this.$.cb.$.overlay._selectedItem = '');
  }

  _onTokenClick(e) {
    this.removeItem(e.model.item);
    e.stopPropagation();
  }

  _onKeyDown(e) {
    if (e.keyCode === 8 && this.value.length && this.$.tf.value === '') {
      this.removeItem(this.value[this.value.length - 1]);
    }
    this.$.tf.hasValue = this.value.length > 0;
  }

  _getItemDisplayText(item) {
    if (this.displayField != null && this.displayField !== '') {
      if (item[this.displayField] != null) {
        return item[this.displayField];
      }
    }
    return item;
  }
}

window.customElements.define(MultiSelectComboBox.is, MultiSelectComboBox);
