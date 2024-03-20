import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { City, WeatherInfo } from './models';
import { fetchWeatherData, getCities } from './clients';

export * from './components/navigation';
export * from './components/form';
export * from './components/weather-table';
export * from './components/city-display';

// FUTURE: Goes for all components, keep CSS and YML strings in separate files
@customElement('peginnov-app')
export class PeginnovApp extends LitElement {
  @property({ type: Array }) currentWeatherInfo: WeatherInfo[] = [];

  @property({ type: Array }) historicWeatherInfo: WeatherInfo[] = [];

  @property({ type: Array }) cities: City[] = [];

  @property({ type: Boolean }) formOpen = false;

  @property({ type: Boolean }) private loading: boolean = true;

  static styles = css`
    h4 {
      margin-left: 20px;
    }

    .city-display {
      margin-left: 20px;
    }

    cds-tabs {
      margin-left: 20px;
    }

    .loader {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  // currently, front loading data calls - in future, could be done on component renders only
  async firstUpdated() {
    this.currentWeatherInfo = await fetchWeatherData('current');
    this.historicWeatherInfo = await fetchWeatherData('historic');
    this.cities = await getCities();
    this.loading = false;
  }

  render() {
    return html`
      ${this.navBar} ${this.header} ${this.loadingSpinner}
      ${this.selectedCities} ${this.tabs} ${this.currentWeatherTable}
      ${this.historicWeatherTable} ${this.searchWeatherForm}
    `;
  }

  private get navBar() {
    return html`
      <peginnov-navigation
        @navigationClicked=${this.handleNavigationClicked}
      ></peginnov-navigation>
    `;
  }

  private get header() {
    return html`<h4>PEG Brain: Weather Dashboard</h4>`;
  }

  private get selectedCities() {
    if (this.loading) {
      return nothing;
    }

    return html` <div class="city-display">
      <peginnov-city-display
        @cityRemoved=${this.handleCityRemoved}
        .cities=${this.cities}
      ></peginnov-city-display>
    </div>`;
  }

  private get tabs() {
    if (this.loading || this.formOpen) {
      return nothing;
    }

    return html`
      <cds-tabs value="all">
        <cds-tab id="tab-all" target="current weather" value="all"
          >Current Weather</cds-tab
        >
        <cds-tab
          id="tab-cloudFoundry"
          target="historic weather"
          value="cloudFoundry"
        >
          3-Day Historical Weather
        </cds-tab>
      </cds-tabs>
    `;
  }

  private get currentWeatherTable() {
    if (this.loading || this.formOpen) {
      return nothing;
    }

    return html` <div id="current weather" role="tabpanel">
      <peginnov-weather-table
        .weatherInfo=${this.currentWeatherInfo}
        @addCitiesClicked=${this.handleAddCitiesClicked}
      ></peginnov-weather-table>
    </div>`;
  }

  private get historicWeatherTable() {
    if (this.loading || this.formOpen) {
      return nothing;
    }

    return html` <div id="historic weather" role="tabpanel">
      <peginnov-weather-table
        .weatherInfo=${this.historicWeatherInfo}
        @addCitiesClicked=${this.handleAddCitiesClicked}
      ></peginnov-weather-table>
    </div>`;
  }

  private get searchWeatherForm() {
    if (!this.formOpen) {
      return nothing;
    }

    return html` <peginnov-form
      @formSubmitted=${this.handleFormSubmit}
    ></peginnov-form>`;
  }

  // FUTURE: componentize this
  private get loadingSpinner() {
    if (!this.loading) {
      return nothing;
    }

    return html` <div class="loader">
      <cds-loading></cds-loading>
    </div>`;
  }

  private handleNavigationClicked(event: CustomEvent) {
    // As part of this assessment, I am just logging this, but this is how I would change active content if
    // I was rendering on the client side otherwise, maybe make a call to the backend to get new content /
    // route new link

    // FUTURE: change to enum options
    switch (event.detail['option']) {
      case 'Dashboard':
        this.formOpen = false;
        break;

      case 'Suggest a Feature':
        alert('Future state: Let users submit their own suggestions');
        break;
    }
  }

  private async handleAddCitiesClicked(event: CustomEvent) {
    this.formOpen = true;
  }

  private async handleCityRemoved(event: CustomEvent) {
    await this.reloadData();
  }

  // FUTURE: instead of re-getting all data, keep state + update data only for new cities
  private async handleFormSubmit(event: CustomEvent) {
    this.formOpen = false;
    await this.reloadData();
  }

  // FUTURE: each reload makes 4 calls to OpenWeather API. In future, could be optimized to only call for new cities added.
  private async reloadData() {
    this.loading = true;
    this.cities = await getCities(); // In theory I don't need this call for handleCityRemoved, but I'm doing it for simplicity
    this.currentWeatherInfo = await fetchWeatherData('current');
    this.historicWeatherInfo = await fetchWeatherData('historic');
    this.loading = false;
  }
}
