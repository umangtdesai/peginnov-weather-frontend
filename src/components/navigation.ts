import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

/*
 * fires: @navigationClicked
 */
@customElement('peginnov-navigation')
export class Navigation extends LitElement {
  @property({ type: String }) activeTab: string = 'Dashboard';

  static styles = css`
    .navigation {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
    }

    .navigation__options {
      display: flex;
      align-items: center;
    }

    .navigation a {
      color: #e22222;
      text-decoration: none;
      font-size: 17px;
      padding: 14px 16px;
    }

    .navigation a:hover,
    a.active {
      background-color: #e22222;
      color: #ffffff;
    }

    .navigation__logo,
    img {
      margin-right: 10px;
      max-height: 25px;
    }
  `;

  render() {
    return html`<div class="navigation">
      ${this.navOptions} ${this.navLogo}
    </div> `;
  }

  // NOTE: ask users to "suggest a feature" is just an idea, currently not implemented
  // IDEA: have a separate insights tab where we use the weather data they searched for to proivde insights on that data
  private get navOptions() {
    const navOptions = ['Dashboard', 'Suggest a Feature'];

    return html`
      <div class="navigation__options">
        ${navOptions.map(
          option => html` <a
            @click=${() => this.onSelect(option)}
            class="${this.activeClass(option)}"
            href="#"
          >
            ${option}
          </a>`
        )}
      </div>
    `;
  }

  private get navLogo() {
    return html`
          <div>
          <img src="assets/brain.jpeg" alt="Brain icon" />
          <img
            class="navigation__logo"
            src="assets/bain-company-full-logo.dvg.svg"
            alt="Bain and Company Logo"
          />
        </div>
      </div>`;
  }

  private activeClass(option: string): string {
    return option === this.activeTab ? 'active' : '';
  }

  // FUTURE: This could be a content from the bank end instead of entirely CSR
  private onSelect(option: string) {
    this.activeTab = option;
    // for parent to listen on and change content based on this
    this.dispatchEvent(
      new CustomEvent('navigationClicked', {
        detail: { option },
      })
    );
  }
}
