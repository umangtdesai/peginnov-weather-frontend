import { css, customElement, html, LitElement } from 'lit-element';
import { City } from '../models';
import { createCity, searchCity } from '../clients';
import { property } from 'lit/decorators.js';
import { nothing } from 'lit';

// NOTE: This component doesn't follow best practices for expediancy reasons.
// I've left all form functionality here but this needs to be broken down into service methods and other logical components

/*
 * fires: @formSubmitted
 */

// FUTURE: additional searching capability on country etc + multi step modal is much better UX

// IDEA: this feature is a great place to fire events to external analytics providers to understand user behavior and ask questions like
// "Why do users truly want to filter on?  How many do they search on on average?  What are the most popular cities?"
@customElement('peginnov-form')
export class Form extends LitElement {
  @property({ type: Array }) citySearchOptions: City[] = [];

  @property({ type: Array }) selectedCities: City[] = [];

  @property({ type: Boolean }) private searched: boolean = false;

  static styles = css`
    :host {
      display: block;
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    form {
      margin-bottom: 20px;
    }

    label,
    h4 {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input[type='text'] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 10px;
    }

    button[type='submit'] {
      padding: 8px 16px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      padding: 8px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    h3 {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
    }
  `;

  render() {
    return html` ${this.formFlow}`;
  }

  private get formFlow() {
    return html`
      ${this.cityForm} ${this.renderCityOptions} ${this.selectedCitiesList}
    `;
  }

  private get cityForm() {
    return html`
      <form class="city-search">
        <label for="city">Seach City</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Search for city"
          required
        />

        <button type="submit" @click=${this.onCitySearchSubmit}>Search</button>
      </form>
      ${this.noSearchResults}
    `;
  }

  private get noSearchResults() {
    if (!this.searched || this.citySearchOptions.length !== 0) {
      return nothing;
    }

    return html` <h4>No search results</h4> `;
  }

  // FUTURE: Can also have "preferences" or "previously searched cities"
  private get renderCityOptions() {
    if (this.citySearchOptions.length === 0) {
      return nothing;
    }

    // show users city details to differentiate cities
    return html`
      <ul>
        ${this.citySearchOptions.map(
          city => html`
            <li>
              ${this.cityDisplayString(city)}
              <button @click=${() => this.selectCity(city)}>Select</button>
            </li>
          `
        )}
      </ul>
    `;
  }

  private get selectedCitiesList() {
    if (this.selectedCities.length === 0) {
      return nothing;
    }

    return html`
      <h4>Selected Cities</h4>
      <ul>
        ${this.selectedCities.map(
          city => html`
            <li>
              ${this.cityDisplayString(city)}
              <button @click=${() => this.removeCity(city)}>Remove</button>
            </li>
          `
        )}
      </ul>
      ${this.searchWeatherButton}
    `;
  }

  private get searchWeatherButton() {
    return html`<button type="submit" @click=${this.onSubmit}>
      Search Weather
    </button>`;
  }

  private cityDisplayString(city: City) {
    return `${city.name}, ${city.country} @ Lat: ${city.lat.toFixed(2)} and
    Lon: ${city.lon.toFixed(2)}`;
  }

  private async selectCity(city: City) {
    // only add city if it's not already in the list
    if (
      this.selectedCities.some(
        c => c.name === city.name && c.lat === city.lat && c.lon === city.lon
      )
    ) {
      return;
    }

    this.selectedCities = [...this.selectedCities, city];
  }

  private removeCity(city: City) {
    this.selectedCities = this.selectedCities.filter(
      c => c.lat !== city.lat || c.lon !== city.lon
    );
  }

  private async onCitySearchSubmit(event: Event) {
    event.preventDefault();
    const form = this.shadowRoot?.querySelector(
      '.city-search'
    ) as HTMLFormElement;
    const formData = new FormData(form);
    const cityName = formData.get('city') as string;

    this.citySearchOptions = await searchCity(cityName);
    this.searched = true;
  }

  private async onSubmit(event: Event) {
    await Promise.all(this.selectedCities.map(city => createCity(city)));

    this.dispatchEvent(
      new CustomEvent('formSubmitted', {
        bubbles: true,
      })
    );
  }
}
