import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WeatherInfo } from './models';
import { fetchWeatherData } from './clients';

export * from './components/navigation';
export * from './components/form';
export * from './components/table';

@customElement('peginnov-app')
export class PeginnovApp extends LitElement {
  @property({ type: Array }) weatherInfo: WeatherInfo[] = [];

  @property({ type: Boolean }) formOpen = false;

  @property({ type: Boolean }) private loading: boolean = true;

  async firstUpdated() {
    this.weatherInfo = await fetchWeatherData();
    this.loading = false;
  }

  render() {
    return html` ${this.navBar} ${this.dataTable} ${this.searchWeatherForm} `;
  }

  private get navBar() {
    return html`<peginnov-navigation
      @navigationClicked=${this.handleNavigationClicked}
    ></peginnov-navigation>`;
  }

  private get dataTable() {
    if (this.formOpen || this.loading) {
      return nothing;
    }

    return html`<peginnov-table
      .weatherInfo=${this.weatherInfo}
      @findWeatherClicked=${this.handeFindWeatherClicked}
    ></peginnov-table>`;
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
    switch (event.detail["option"]) {
      case 'Dashboard':
        this.formOpen = false;
        break;
      
      case 'Suggest a Feature':
        alert("Future state: Let users submit their own suggestions");
        break;
    }
  }

  private async handeFindWeatherClicked(event: CustomEvent) {
    this.formOpen = true;
  }

  // FUTURE: instead of re-getting all data, cache or keep state + update data to a single data provider service
  private async handleFormSubmit(event: CustomEvent) {
    this.weatherInfo = await fetchWeatherData();
    this.formOpen = false;
  }
}
