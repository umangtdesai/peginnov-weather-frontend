import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { City } from '../models';
import { deleteCity } from '../clients';

@customElement('peginnov-city-display')
export class CityDisplay extends LitElement {
  static styles = css`
    ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button {
      margin-left: 5px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: red;
    }
  `;

  @property({ type: Array })
  cities: City[] = [];

  render() {
    return html`
      <ul>
        ${this.cities.map(
          city => html`
            <li>
              ${city.name}, ${city.country}
              <button @click=${() => this.removeCity(city)}>X</button>
            </li>
          `
        )}
      </ul>
    `;
  }

  async removeCity(city: City) {
    const index = this.cities.indexOf(city);

    if (index !== -1) {
      this.removeCityAndDispatchEvent(index, city);
    }
  }

  private async removeCityAndDispatchEvent(cityIndex: number, city: City) {
    this.cities.splice(cityIndex, 1);
    await deleteCity(city.id);
    this.requestUpdate();

    this.dispatchEvent(new CustomEvent('cityRemoved'));
  }
}
